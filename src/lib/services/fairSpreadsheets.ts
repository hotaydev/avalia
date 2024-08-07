import { JWT } from "google-auth-library";
import { GoogleSpreadsheet, type GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { ErrorMessage } from "../constants/errors";
import type { Category } from "../models/category";
import type { Evaluation } from "../models/evaluation";
import type { Evaluator } from "../models/evaluator";
import type { ProjectForAdmin, ProjectForEvaluator } from "../models/project";
import type { Question } from "../models/question";
import generateId from "./generateId";

const fairsSpreadsheetTitlesOfSheets = {
  evaluators: "Avaliadores",
  projects: "Projetos",
  categories: "Categorias",
  answers: "Respostas",
};

export default class FairSpreadsheet {
  private token: JWT;
  private spreadsheetId: string;

  constructor({ spreadsheetId }: { spreadsheetId?: string }) {
    if (!spreadsheetId) {
      throw new Error("FairSpreadsheet() needs to be initialized passing `spreadsheetId` parameter");
    }

    if (!(process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_EMAIL && process.env.SERVICE_ACCOUNT_PRIVATE_KEY)) {
      throw new Error(
        "NEXT_PUBLIC_SERVICE_ACCOUNT_EMAIL or SERVICE_ACCOUNT_PRIVATE_KEY environment variables not configured",
      );
    }

    this.token = new JWT({
      email: process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_EMAIL,
      key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
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
          evaluation: undefined, // It will not be used in this response, so we can use any response
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
      const evaluationsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.answers);

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

      const evaluations: Evaluation[] = [];
      for (const row of await evaluationsSheet.getRows()) {
        evaluations.push({
          project: row.get("Projeto"),
          evaluator: row.get("Avaliador"),
          notes: {}, // Can Be kept in blank, we don't need this info for this purpose
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
          evaluations: evaluations.filter((evaluation) => evaluation.project === id).length,
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
      const projectsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.projects);

      const { projectsToRemove, projectsToAdd } = await this.getProjectsSyncForEvaluatorAssign(
        evaluatorId,
        projectsIds,
      );

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

  private async getProjectsSyncForEvaluatorAssign(
    evaluatorId: string,
    projectsIds: string,
  ): Promise<{ projectsToRemove: string[]; projectsToAdd: string[] }> {
    const newProjectsIds = projectsIds.split(",").filter((val: string) => val !== "");

    let projectsToRemove: string[] = [];
    let projectsToAdd: string[] = [];

    const evaluatorsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.evaluators);

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

    return { projectsToRemove, projectsToAdd };
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

  public async getSingleEvaluator(evaluatorCode: string): Promise<Evaluator | undefined> {
    if (!evaluatorCode) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    try {
      const evaluatorsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.evaluators);

      let evaluator: Evaluator | undefined = undefined;
      for (const row of await evaluatorsSheet.getRows()) {
        if (row.get("ID") === evaluatorCode) {
          const projectIds = (row.get("Projetos Atribuídos") ?? "").split(",");

          const projectsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.projects);
          const evaluations = await this.getEvaluationsForEvaluator(evaluatorCode);

          const projects: ProjectForEvaluator[] = [];
          for (const proj of await projectsSheet.getRows()) {
            const id = proj.get("ID");
            if (projectIds.includes(id)) {
              projects.push({
                id: id,
                title: proj.get("Título"),
                description: proj.get("Descrição"),
                category: proj.get("Categoria"),
                evaluation: evaluations.filter((evaluation) => evaluation.project === id)[0] ?? undefined,
              });
            }
          }

          evaluator = {
            id: row.get("ID"),
            name: row.get("Nome"),
            email: row.get("Email"),
            phone: row.get("Telefone"),
            field: row.get("Área de Atuação"),
            projects: projects,
          };
          break;
        }
      }

      return evaluator;
    } catch (error) {
      throw new Error((error as Error).message ?? error);
    }
  }

  private async getEvaluationsForEvaluator(evaluatorCode: string): Promise<Evaluation[]> {
    const evaluatorsAnswersSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.answers);

    const evaluations: Evaluation[] = [];
    for (const evaluation of await evaluatorsAnswersSheet.getRows()) {
      if (evaluation.get("Avaliador") === evaluatorCode) {
        const notes = {
          metodology: evaluation.get("Metodologia") ?? 0,
          documents: evaluation.get("Documentos") ?? 0,
          visualApresentation: evaluation.get("Apresentação Visual") ?? 0,
          oralApresentation: evaluation.get("Apresentação Oral") ?? 0,
          relevancy: evaluation.get("Relevância") ?? 0,
        };

        evaluations.push({
          project: evaluation.get("Projeto"),
          evaluator: evaluation.get("Avaliador"),
          notes: notes,
          finalConsiderations: evaluation.get("Considerações Finais") ?? "",
        });
      }
    }

    return evaluations;
  }

  public async createEvaluatorAnswer({
    evaluator,
    project,
    questions,
  }: { evaluator: string; project: string; questions: Question[] }): Promise<Evaluation> {
    if (!(evaluator && questions && project)) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    try {
      const answersSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.answers);

      const notes = {
        metodology: (questions.filter((quest) => quest.title.toLowerCase() === "metodologia")[0].value ?? 0) as number,
        documents: (questions.filter((quest) => quest.title.toLowerCase() === "documentos")[0].value ?? 0) as number,
        visualApresentation: (questions.filter((quest) => quest.title.toLowerCase() === "apresentação visual")[0]
          .value ?? 0) as number,
        oralApresentation: (questions.filter((quest) => quest.title.toLowerCase() === "apresentação oral")[0].value ??
          0) as number,
        relevancy: (questions.filter((quest) => quest.title.toLowerCase() === "relevância")[0].value ?? 0) as number,
        finalConsiderations: (questions.filter((quest) => quest.title.toLowerCase() === "considerações finais")[0]
          .value ?? "") as string,
      };

      await answersSheet.addRow({
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Projeto: project.toUpperCase(),
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Avaliador: evaluator.toUpperCase(),
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Metodologia: notes.metodology,
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Documentos: notes.documents,
        "Apresentação Visual": notes.visualApresentation,
        "Apresentação Oral": notes.oralApresentation,
        // biome-ignore lint/style/useNamingConvention: the Spreadsheet uses a more easy to understand column name
        Relevância: notes.relevancy,
        "Considerações Finais": notes.finalConsiderations,
      });

      return {
        project: project.toUpperCase(),
        evaluator: evaluator.toUpperCase(),
        notes: {
          metodology: notes.metodology,
          documents: notes.documents,
          visualApresentation: notes.visualApresentation,
          oralApresentation: notes.oralApresentation,
          relevancy: notes.relevancy,
        },
        finalConsiderations: notes.finalConsiderations,
      };
    } catch (error) {
      throw new Error((error as Error).message ?? error);
    }
  }

  public async getRanking(): Promise<Category[]> {
    try {
      const categoriesList: string[] = await this.getCategories();
      const scoresSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.answers);
      const projectsSheet = await this.getSheetByTitle(fairsSpreadsheetTitlesOfSheets.projects);

      const evaluations: Evaluation[] = [];
      for (const evaluation of await scoresSheet.getRows()) {
        evaluations.push({
          project: evaluation.get("Projeto"),
          evaluator: evaluation.get("Avaliador"),
          notes: {
            metodology: Number.parseInt(evaluation.get("Metodologia")),
            documents: Number.parseInt(evaluation.get("Documentos")),
            visualApresentation: Number.parseInt(evaluation.get("Apresentação Visual")),
            oralApresentation: Number.parseInt(evaluation.get("Apresentação Oral")),
            relevancy: Number.parseInt(evaluation.get("Relevância")),
          },
          // Don't need the "finalConsiderations" here, since it doesn't change the final score
        });
      }

      const projects: ProjectForAdmin[] = [];
      for (const project of await projectsSheet.getRows()) {
        projects.push({
          id: project.get("ID"),
          title: project.get("Título"),
          description: project.get("Descrição"),
          category: project.get("Categoria"),
          field: project.get("Área"),
          score: this.getProjectScore(project.get("ID"), evaluations),
          evaluators: [], // Note: Evaluators array can be blank, it's not necessary for the Ranking
        });
      }

      const categories: Category[] = categoriesList.map((category) => {
        return {
          title: category,
          projects: projects.filter((proj) => proj.category === category),
        };
      });

      return categories;
    } catch (error) {
      throw new Error((error as Error).message ?? error);
    }
  }

  private getProjectScore(projectId: string, evaluations: Evaluation[]): number {
    let projectScoresSum = 0;
    let projectScoresCount = 0;

    for (const evaluation of evaluations) {
      if (evaluation.project === projectId) {
        projectScoresSum += evaluation.notes.documents ?? 0;
        projectScoresSum += evaluation.notes.metodology ?? 0;
        projectScoresSum += evaluation.notes.oralApresentation ?? 0;
        projectScoresSum += evaluation.notes.relevancy ?? 0;
        projectScoresSum += evaluation.notes.visualApresentation ?? 0;
        projectScoresCount += 5;
      }
    }

    return projectScoresSum !== 0 ? Number.parseFloat((projectScoresSum / projectScoresCount).toPrecision(3)) : 0;
  }
}
