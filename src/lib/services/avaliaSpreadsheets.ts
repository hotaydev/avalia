import { randomUUID } from "node:crypto";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet, type GoogleSpreadsheetRow, type GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import type { ScienceFair } from "../models/scienceFair";

const adminSpreadsheetTitlesOfSheets = {
  fairs: "Science Fairs",
  users: "Users",
};

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

  public async saveNewFair(fairName: string, fairSchool: string, adminEmail: string): Promise<Error | string> {
    if (!(fairName && fairSchool && adminEmail)) {
      return new Error("Parameters need to be passed");
    }

    // TODO: we can also check if the user don't already exists (double-check)

    const fairsSheet = await this.getAdminSheetByTitle(adminSpreadsheetTitlesOfSheets.fairs);
    const usersSheet = await this.getAdminSheetByTitle(adminSpreadsheetTitlesOfSheets.users);
    const fairId = randomUUID();

    try {
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
      return new Error(`ERROR: ${error}`);
    }
  }

  public async getFairFromUser(email: string): Promise<Error | ScienceFair> {
    if (!email) {
      return new Error("Parameter need to be passed");
    }

    const usersSheet = await this.getAdminSheetByTitle(adminSpreadsheetTitlesOfSheets.users);

    let fairId = "";
    for (const user of await usersSheet.getRows()) {
      if (user.get("email") === email) {
        fairId = user.get("fairId");
        break;
      }
    }

    if (!fairId) {
      return new Error("Fair not found");
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
      return new Error("Fair not found");
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
}
