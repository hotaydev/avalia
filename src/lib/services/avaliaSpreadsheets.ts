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
  public token;

  constructor() {
    if (!(process.env.SERVICE_ACCOUNT_EMAIL && process.env.SERVICE_ACCOUNT_PRIVATE_KEY)) {
      throw new Error("SERVICE_ACCOUNT_EMAIL or SERVICE_ACCOUNT_PRIVATE_KEY environment variables not configured");
    }

    this.token = new JWT({
      email: process.env.SERVICE_ACCOUNT_EMAIL,
      key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
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

  private async getAdminSheetByTitle(title: string): Promise<GoogleSpreadsheetWorksheet> {
    const document = await this.getAdminDocument();
    return document.sheetsByTitle[title];
  }

  public async saveNewFair(fairName: string, fairSchool: string, adminEmail: string): Promise<string> {
    if (!(fairName && fairSchool && adminEmail)) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    try {
      const fairsSheet = await this.getAdminSheetByTitle(adminSpreadsheetTitlesOfSheets.fairs);
      const usersSheet = await this.getAdminSheetByTitle(adminSpreadsheetTitlesOfSheets.users);
      const fairId = randomUUID();

      const emailAlreadyInUse = await this.checkIfValueExists("email", adminEmail, usersSheet);
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

  private async checkIfValueExists(
    key: string,
    value: string,
    sheet: GoogleSpreadsheetWorksheet,
  ): Promise<number | string | undefined | null | boolean> {
    let returnValue = "";
    for (const singleValue of await sheet.getRows()) {
      if (singleValue.get(key) === value) {
        returnValue = singleValue.get("fairId");
        break;
      }
    }

    return returnValue;
  }

  public async getFairFromUser(email: string): Promise<ScienceFair> {
    if (!email) {
      throw new Error(ErrorMessage.lackOfParameters);
    }

    const usersSheet = await this.getAdminSheetByTitle(adminSpreadsheetTitlesOfSheets.users);

    const fairId = await this.checkIfValueExists("email", email, usersSheet);
    if (!fairId) {
      throw new Error(ErrorMessage.fairNotFound);
    }

    const fairsSheet = await this.getAdminSheetByTitle(adminSpreadsheetTitlesOfSheets.fairs);

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

    const usersSheet = await this.getAdminSheetByTitle(adminSpreadsheetTitlesOfSheets.users);

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

    const fairSheet = await this.getAdminSheetByTitle(adminSpreadsheetTitlesOfSheets.fairs);

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

    const fairSheet = await this.getAdminSheetByTitle(adminSpreadsheetTitlesOfSheets.fairs);

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
}
