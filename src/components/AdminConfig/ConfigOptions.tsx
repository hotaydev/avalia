import ConfigItem from "./ConfigItem";
import EditEvaluatorsMessage from "./EvaluatorsMessage";
import EvaluatorsQuestionaire from "./EvaluatorsQuestionaire";
import EventDates from "./EventDates";
import SheetsData from "./SheetsData";
import UsersConfiguration from "./UsersConfiguration";

export default function ConfigOptions({ showEditEvaluatorsMessage = false }: { showEditEvaluatorsMessage?: boolean }) {
  return (
    <div className="space-y-3 flex flex-col justify-center items-center">
      <SheetsData />
      <EventDates />
      <EditEvaluatorsMessage needToOpenDialog={showEditEvaluatorsMessage} />
      <UsersConfiguration />
      <EvaluatorsQuestionaire />
      <ConfigItem text="Página de Cadastro de Avaliadores" soon={true} />
      <ConfigItem text="Página de Cadastro de Projetos" soon={true} />
    </div>
  );
}
