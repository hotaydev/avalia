import { JWT } from "google-auth-library";
import { GoogleSpreadsheet, type GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { ErrorMessage } from "../constants/errors";
import type { Evaluator } from "../models/evaluator";
import type { ProjectForAdmin, ProjectForEvaluator } from "../models/project";
import generateId from "./generateId";

const fairsSpreadsheetTitlesOfSheets = {
  evaluators: "Avaliadores",
  projects: "Projetos",
  categories: "Categorias",
  answers: "Resostas",
};

export default class FairSpreadsheet {
  private token: JWT;
  private spreadsheetId: string;

  constructor({ spreadsheetId }: { spreadsheetId?: string }) {
    if (!spreadsheetId) {
      throw new Error("FairSpreadsheet() needs to be initialized passing `spreadsheetId` parameter");
    }

    if (!(process.env.SERVICE_ACCOUNT_EMAIL && process.env.SERVICE_ACCOUNT_PRIVATE_KEY)) {
      throw new Error("SERVICE_ACCOUNT_EMAIL or SERVICE_ACCOUNT_PRIVATE_KEY environment variables not configured");
    }

    this.token = new JWT({
      email: process.env.SERVICE_ACCOUNT_EMAIL,
      key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.spreadsheetId = spreadsheetId;
  }

  private async getDocument(): Promise<GoogleSpreadsheet> {
    const document = new GoogleSpreadsheet(this.spreadsheetId, this.token);
    await document.loadInfo();
    return document;
  }

  private async getSheetByTitle(title: string): Promise<GoogleSpreadsheetWorksheet> {
    try {
      const document = await this.getDocument();
      return document.sheetsByTitle[title];
    } catch (_error) {
      throw new Error(
        "Parece que não temos acesso à planilha. Você compartilhou a planilha com a conta de serviço, conforme instruções na página de configuração?",
      );
    }
  }

  public async getEvaluators(): Promise<Evaluator[]> {
    try {
      const evaluatorsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.evaluators);
      const projectsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.projects);

      const projects: ProjectForEvaluator[] = [];
      for (const row of await projectsSheet.getRows()) {
        let id = row.get("ID");

        if (!id) {
          id = generateId();
          row.set("ID", id);
          row.save();
        }

        projects.push({
          id: id,
          title: row.get("Título"),
          description: row.get("Descrição"),
          category: row.get("Categoria"),
          evaluated: false, // It will not be used in this response, so we can use any response
        });
      }

      const evaluators: Evaluator[] = [];
      for (const row of await evaluatorsSheet.getRows()) {
        let id = row.get("ID");

        if (!id) {
          id = generateId();
          row.set("ID", id);
          row.save();
        }

        const projectIds = (row.get("Projetos Atribuídos") ?? "").split(",");

        evaluators.push({
          id: id,
          name: row.get("Nome"),
          email: row.get("Email"),
          phone: row.get("Telefone"),
          field: row.get("Área de Atuação"),
          projects: projects.filter((proj) => projectIds.includes(proj.id)),
        });
      }

      return evaluators;
    } catch (error) {
      throw new Error((error as Error).message ?? error);
    }
  }

  public async getProjects(): Promise<ProjectForAdmin[]> {
    try {
      const evaluatorsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.evaluators);
      const projectsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.projects);

      const evaluators: Evaluator[] = [];
      for (const row of await evaluatorsSheet.getRows()) {
        let id = row.get("ID");

        if (!id) {
          id = generateId();
          row.set("ID", id);
          row.save();
        }

        evaluators.push({
          id: id,
          name: row.get("Nome"),
          email: row.get("Email"),
          phone: row.get("Telefone"),
          field: row.get("Área de Atuação"),
          projects: [], // Don't need this info. Actually, we will use this on projects listing, so there's no need of this info.
        });
      }

      const projects: ProjectForAdmin[] = [];
      for (const row of await projectsSheet.getRows()) {
        let id = row.get("ID");

        if (!id) {
          id = generateId();
          row.set("ID", id);
          row.save();
        }

        const evaluatorsIds = (row.get("Avaliadores") ?? "").split(",");

        projects.push({
          id: id,
          title: row.get("Título"),
          description: row.get("Descrição"),
          category: row.get("Categoria"),
          field: row.get("Área"),
          score: Number.parseInt(row.get("Nota")) || 0, // No project can have a "0" note (the minimum is 1 in each question), so the "0" is like "unevaluated yet"
          evaluators: evaluators.filter((evaluator) => evaluatorsIds.includes(evaluator.id)),
        });
      }

      return projects;
    } catch (error) {
      throw new Error((error as Error).message ?? error);
    }
  }

  public async attributeEvaluatorAndProject(evaluatorId: string, projectsIds: string): Promise<boolean> {
    // TODO: use regex to validate the format of projectsIds (ex. abc4,atr5,3d5f,s5g6,t667, ....)
    if (!(evaluatorId && projectsIds)) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    try {
      const newProjectsIds = projectsIds.split(",").filter((val: string) => val !== "");

      let projectsToRemove: string[] = [];
      let projectsToAdd: string[] = [];

      const evaluatorsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.evaluators);
      const projectsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.projects);

      for (const row of await evaluatorsSheet.getRows()) {
        if (row.get("ID") === evaluatorId) {
          const attributedProjects = row.get("Projetos Atribuídos");
          if (attributedProjects && attributedProjects !== "") {
            const oldProjectsIds: string[] = attributedProjects.split(",").filter((val: string) => val !== "");
            projectsToRemove = oldProjectsIds.filter((value) => !newProjectsIds.includes(value));
            projectsToAdd = newProjectsIds.filter((value) => !oldProjectsIds.includes(value));
          } else {
            projectsToAdd = newProjectsIds;
          }

          row.set("Projetos Atribuídos", projectsIds);
          row.save();
          break;
        }
      }

      for (const row of await projectsSheet.getRows()) {
        const projectId = row.get("ID");
        const evaluatorsIds: string[] = (row.get("Avaliadores") ?? "").split(",").filter((val: string) => val !== "");

        if (projectsToRemove.includes(projectId)) {
          // Remove the evaluator ID
          const newData = evaluatorsIds.filter((ev) => ev !== evaluatorId);
          row.set("Avaliadores", newData.join(","));
          row.save();
        } else if (projectsToAdd.includes(projectId)) {
          // Add the evaluator ID
          const newData = evaluatorsIds.concat(evaluatorId);
          row.set("Avaliadores", newData.join(","));
          row.save();
        }
      }

      return true;
    } catch (error) {
      throw new Error((error as Error).message ?? error);
    }
  }

  public async getCategories(): Promise<string[]> {
    try {
      const categoriesSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.categories);

      const categories: string[] = [];
      for (const row of await categoriesSheet.getRows()) {
        categories.push(row.get("Categoria"));
      }

      return categories;
    } catch (error) {
      throw new Error((error as Error).message ?? error);
    }
  }

  public async createEvaluator({
    evaluatorName,
    evaluatorEmail,
    evaluatorPhone,
    evaluatorArea,
  }: {
    evaluatorName: string;
    evaluatorEmail: string;
    evaluatorPhone: string;
    evaluatorArea: string;
  }): Promise<string> {
    if (!evaluatorName) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    try {
      const evaluatorsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.evaluators);
      const id = generateId();

      await evaluatorsSheet.addRow({
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        ID: id,
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Nome: evaluatorName,
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Email: evaluatorEmail,
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Telefone: evaluatorPhone,
        "Área de Atuação": evaluatorArea,
        "Projetos Atribuídos": "",
      });

      return id;
    } catch (error) {
      throw new Error((error as Error).message ?? error);
    }
  }

  public async createProject({
    projectName,
    projectDescription,
    projectCategory,
    projectArea,
  }: {
    projectName: string;
    projectDescription: string;
    projectCategory: string;
    projectArea: string;
  }): Promise<string> {
    if (!(projectName && projectCategory)) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    try {
      const projectsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.projects);
      const id = generateId();

      await projectsSheet.addRow({
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        ID: id,
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Título: projectName,
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Descrição: projectDescription,
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Categoria: projectCategory,
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Área: projectArea,
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Nota: "",
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Avaliadores: "",
      });

      return id;
    } catch (error) {
      throw new Error((error as Error).message ?? error);
    }
  }

  public async checkIfEvaluatorExists(code: string): Promise<boolean> {
    if (!code) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    try {
      const evaluatorsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.evaluators);

      let evaluatorFound = false;
      for (const row of await evaluatorsSheet.getRows()) {
        if (row.get("ID") === code) {
          evaluatorFound = true;
          break;
        }
      }

      return evaluatorFound;
    } catch (error) {
      throw new Error((error as Error).message ?? error);
    }
  }
}
