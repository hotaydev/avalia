import { randomUUID } from "node:crypto";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet, type GoogleSpreadsheetRow, type GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { ErrorMessage } from "../constants/errors";
import type { ScienceFair } from "../models/scienceFair";
import type { FairUser } from "../models/user";

const adminSpreadsheetTitlesOfSheets = {
  fairs: "Science Fairs",
  users: "Users",
};

// TODO: all methods of this class can verify the user validity by its access token. Maybe using a middleware?
export default class AvaliaSpreadsheet {
  private token;

  constructor() {
    if (!(process.env.SERVICE_ACCOUNT_EMAIL && process.env.SERVICE_ACCOUNT_PRIVATE_KEY)) {
      throw new Error("SERVICE_ACCOUNT_EMAIL or SERVICE_ACCOUNT_PRIVATE_KEY environment variables not configured");
    }

    this.token = new JWT({
      email: process.env.SERVICE_ACCOUNT_EMAIL,
      key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }

  // NOTE: we don't store it in a class-defined property to properly handle changes.
  //       The caching and optimizations are made on frontend, and API is protected by rate-limiting requests
  private async getAdminDocument(): Promise<GoogleSpreadsheet> {
    if (!process.env.ADMIN_SPREADSHEET_ID) {
      throw new Error("ADMIN_SPREADSHEET_ID environment variable not configured");
    }

    const document = new GoogleSpreadsheet(process.env.ADMIN_SPREADSHEET_ID, this.token);
    await document.loadInfo();
    return document;
  }

  private async getSheetByTitle(title: string): Promise<GoogleSpreadsheetWorksheet> {
    try {
      const document = await this.getAdminDocument();
      return document.sheetsByTitle[title];
    } catch (_error) {
      throw new Error(
        "Parece que não temos acesso à planilha. Você compartilhou a planilha com a conta de serviço, conforme instruções na página de configuração?",
      );
    }
  }

  public async saveNewFair(fairName: string, fairSchool: string, adminEmail: string): Promise<string> {
    if (!(fairName && fairSchool && adminEmail)) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    try {
      const fairsSheet = await this.getSheetByTitle(adminSpreadsheetTitlesOfSheets.fairs);
      const usersSheet = await this.getSheetByTitle(adminSpreadsheetTitlesOfSheets.users);
      const fairId = randomUUID();

      let emailAlreadyInUse = "";
      for (const row of await usersSheet.getRows()) {
        if (row.get("email") === adminEmail) {
          emailAlreadyInUse = row.get("fairId");
          break;
        }
      }

      if (emailAlreadyInUse) {
        throw new Error(ErrorMessage.emailAlreadyInUse);
      }

      await fairsSheet.addRow({
        adminEmail: adminEmail,
        fairName: fairName,
        fairId: fairId,
        fairSchool: fairSchool,
        spreadsheetId: "",
        startDate: "",
        endDate: "",
      });

      await usersSheet.addRow({
        email: adminEmail,
        fairId: fairId,
        inviteAccepted: 1,
      });

      return fairId;
    } catch (error) {
      throw new Error((error as Error).message ?? error);
    }
  }

  public async addNewNonAdminUser(fairId: string, email: string): Promise<boolean> {
    if (!(fairId && email)) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    const fairSheet = await this.getSheetByTitle(adminSpreadsheetTitlesOfSheets.fairs);
    const userSheet = await this.getSheetByTitle(adminSpreadsheetTitlesOfSheets.users);

    let fairExists = false;
    for (const row of await fairSheet.getRows()) {
      if (row.get("fairId") === fairId) {
        fairExists = true;
        break;
      }
    }

    if (!fairExists) {
      throw new Error("Feira não encontrada");
    }

    let isNewUser = true;
    for (const row of await userSheet.getRows()) {
      if (row.get("email") === email) {
        isNewUser = false;
        break;
      }
    }

    if (isNewUser) {
      try {
        userSheet.addRow({
          email: email,
          fairId: fairId,
          inviteAccepted: 0,
        });

        return true;
      } catch (error) {
        throw new Error(`Erro ao criar novo usuário: ${error}`);
      }
    }

    return false;
  }

  public async getFairFromUserOrId(email: string | null, fairId: string | null): Promise<ScienceFair> {
    if (fairId) {
      return await this.getFairFromId(fairId);
    }

    if (email) {
      return await this.getFairFromEmail(email);
    }

    throw new Error(ErrorMessage.lackOfParameters);
  }

  private async getFairFromEmail(email: string): Promise<ScienceFair> {
    if (!email) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    const usersSheet = await this.getSheetByTitle(adminSpreadsheetTitlesOfSheets.users);

    let row: GoogleSpreadsheetRow | undefined = undefined;
    let fairId = "";
    for (const singleValue of await usersSheet.getRows()) {
      if (singleValue.get("email") === email) {
        fairId = singleValue.get("fairId");
        if (singleValue.get("inviteAccepted")) {
          row = singleValue;
        }
        break;
      }
    }

    if (!fairId) {
      throw new Error(ErrorMessage.fairNotFound);
    }

    const fairsSheet = await this.getSheetByTitle(adminSpreadsheetTitlesOfSheets.fairs);

    let foundFair: GoogleSpreadsheetRow | undefined = undefined;
    for (const fair of await fairsSheet.getRows()) {
      if (fair.get("fairId") === fairId) {
        foundFair = fair;
        break;
      }
    }

    if (!foundFair) {
      throw new Error(ErrorMessage.fairNotFound);
    }

    if (row) {
      row.set("inviteAccepted", 1);
      row.save();
    }

    return {
      adminEmail: foundFair.get("adminEmail"),
      fairName: foundFair.get("fairName"),
      fairId: foundFair.get("fairId"),
      fairSchool: foundFair.get("fairSchool"),
      spreadsheetId: foundFair.get("spreadsheetId"),
      startDate: foundFair.get("startDate"),
      endDate: foundFair.get("endDate"),
    };
  }

  private async getFairFromId(fairId: string): Promise<ScienceFair> {
    if (!fairId) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    const fairsSheet = await this.getSheetByTitle(adminSpreadsheetTitlesOfSheets.fairs);

    let foundFair: GoogleSpreadsheetRow | undefined = undefined;
    for (const fair of await fairsSheet.getRows()) {
      if (fair.get("fairId") === fairId) {
        foundFair = fair;
        break;
      }
    }

    if (!foundFair) {
      throw new Error(ErrorMessage.fairNotFound);
    }

    return {
      adminEmail: foundFair.get("adminEmail"),
      fairName: foundFair.get("fairName"),
      fairId: foundFair.get("fairId"),
      fairSchool: foundFair.get("fairSchool"),
      spreadsheetId: foundFair.get("spreadsheetId"),
      startDate: foundFair.get("startDate"),
      endDate: foundFair.get("endDate"),
    };
  }

  public async getFairUsers(fairId: string, email: string): Promise<FairUser[]> {
    if (!(fairId && email)) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    const usersSheet = await this.getSheetByTitle(adminSpreadsheetTitlesOfSheets.users);

    const users = [];
    for (const row of await usersSheet.getRows()) {
      if (row.get("fairId") === fairId) {
        users.push({
          fairId: fairId,
          inviteAccepted: row.get("inviteAccepted") === 1 || row.get("inviteAccepted") === "1",
          email: row.get("email"),
        });
      }
    }

    const isRequestingUserInTheFair: boolean = users.some((user) => user.email === email);
    if (!isRequestingUserInTheFair) {
      throw new Error("Você só pode buscar outros usuários da mesma feira.");
    }

    return users.filter((user) => user.email !== email);
  }

  public async saveFairDates(
    fairId: string,
    dates: { initDate?: string | null; endDate?: string | null; initTime?: string | null; endTime?: string | null },
  ): Promise<boolean> {
    if (!fairId) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    if (!(dates.initDate || dates.endDate)) {
      return true; // success (ignored)
    }

    const startDateString = dates.initDate ? `${dates.initDate}T${dates.initTime ?? "00:00"}:00.000-03:00` : "";
    const endDateString = dates.endDate ? `${dates.endDate}T${dates.endTime ?? "00:00"}:00.000-03:00` : "";

    const fairSheet = await this.getSheetByTitle(adminSpreadsheetTitlesOfSheets.fairs);

    let changed = false;
    for (const row of await fairSheet.getRows()) {
      if (row.get("fairId") === fairId) {
        row.set("startDate", startDateString);
        row.set("endDate", endDateString);
        row.save();
        changed = true;
        break;
      }
    }

    return changed;
  }

  public async saveFairSpreadsheetId(fairId: string, linkId: string): Promise<boolean> {
    if (!(fairId && linkId)) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    const sheetId = linkId.replace("https://docs.google.com/spreadsheets/d/", "").replace(/\/edit.*/, "");

    const fairSheet = await this.getSheetByTitle(adminSpreadsheetTitlesOfSheets.fairs);

    let changed = false;
    for (const row of await fairSheet.getRows()) {
      if (row.get("fairId") === fairId) {
        row.set("spreadsheetId", sheetId);
        row.save();
        changed = true;
        break;
      }
    }

    return changed;
  }

  public async removeUserAccess(fairId: string, email: string): Promise<boolean> {
    if (!(fairId && email)) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    const fairSheet = await this.getSheetByTitle(adminSpreadsheetTitlesOfSheets.fairs);
    const userSheet = await this.getSheetByTitle(adminSpreadsheetTitlesOfSheets.users);

    let adminEmail = "";
    for (const row of await fairSheet.getRows()) {
      if (row.get("fairId") === fairId) {
        adminEmail = row.get("adminEmail");
        break;
      }
    }

    if (!adminEmail) {
      throw new Error("Feira não encontrada");
    }
    if (adminEmail === email) {
      throw new Error("Não é possível remover o usuário administrador da Feira");
    }

    let hadRemovedUser = false;
    for (const row of await userSheet.getRows()) {
      if (row.get("email") === email) {
        row.delete();
        hadRemovedUser = true;
        break;
      }
    }

    return hadRemovedUser;
  }

  public async getAllFairs(): Promise<ScienceFair[]> {
    try {
      const fairsSheet = await this.getSheetByTitle(adminSpreadsheetTitlesOfSheets.fairs);

      const fairs: ScienceFair[] = [];
      for (const row of await fairsSheet.getRows()) {
        fairs.push({
          adminEmail: row.get("adminEmail"),
          fairName: row.get("fairName"),
          fairId: row.get("fairId"),
          fairSchool: row.get("fairSchool"),
          spreadsheetId: row.get("spreadsheetId"),
          startDate: row.get("startDate"),
          endDate: row.get("endDate"),
        });
      }
      return fairs;
    } catch (error) {
      throw new Error((error as Error).message ?? error);
    }
  }
}
