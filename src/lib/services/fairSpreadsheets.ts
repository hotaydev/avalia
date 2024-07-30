import { GoogleSpreadsheet } from "google-spreadsheet";
import AvaliaSpreadsheet from "./avaliaSpreadsheets";

// biome-ignore lint/correctness/noUnusedVariables: It'll be used soon
const fairsSpreadsheetTitlesOfSheets = {
  evaluators: "Avaliadores",
  projects: "Projetos",
  categories: "Categorias",
  answers: "Resostas",
};

export default class FairSpreadsheet {
  private document: GoogleSpreadsheet | undefined;

  constructor({ spreadsheetId }: { spreadsheetId: string }) {
    if (!spreadsheetId) {
      throw new Error("FairSpreadsheet() needs to be initialized passing `spreadsheetId` parameter");
    }

    const fairDocument = new GoogleSpreadsheet(spreadsheetId, new AvaliaSpreadsheet().token);
    fairDocument.loadInfo();

    this.document = fairDocument;
  }
}
