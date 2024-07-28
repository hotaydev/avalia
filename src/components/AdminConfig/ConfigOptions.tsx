import ConfigItem from "./ConfigItem";
import EvaluatorsQuestionaire from "./EvaluatorsQuestionaire";
import EventDates from "./EventDates";
import SheetsData from "./SheetsData";
import UsersConfiguration from "./UsersConfiguration";

export default function ConfigOptions() {
  return (
    <div className="space-y-3 flex flex-col justify-center items-center">
      <SheetsData />
      <EventDates />
      <EvaluatorsQuestionaire />
      <UsersConfiguration />
      <ConfigItem text="Página de Cadastro de Avaliadores" soon={true} />
      <ConfigItem text="Página de Cadastro de Projetos" soon={true} />
    </div>
  );
}
