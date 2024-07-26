import { useState } from "react";
import DialogComponent from "../Dialog/Dialog";
import ConfigItem from "./ConfigItem";

interface DateTimeConfiguration {
  initDate?: string;
  endDate?: string;
  initTime?: string;
  endTime?: string;
}

export default function EventDates() {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [_dateConfig, setDateConfig] = useState<DateTimeConfiguration>({});

  const handleDateChange = (value: string, type: keyof DateTimeConfiguration): void => {
    setDateConfig((prevConfig) => ({
      ...prevConfig,
      [type]: value,
    }));
  };

  return (
    <>
      <ConfigItem text="Datas da Feira" onClick={() => setDialogIsOpen(true)} />
      <DialogComponent
        open={dialogIsOpen}
        setOpen={setDialogIsOpen}
        titleCentered={true}
        title="Configurar Datas da Feira"
        buttonText="Salvar alterações"
        // onClick={() => {}}
      >
        <div className="flex space-y-4 px-6 flex-col mt-8 mb-2 w-full">
          <DateRow text="Data de início:" handleDateChange={handleDateChange} initOrEnd="init" />
          <div>
            <hr />
          </div>
          <DateRow text="Data de término:" handleDateChange={handleDateChange} initOrEnd="end" />
          <div className="w-full text-center flex items-center justify-center pt-4 font-light text-xs">
            <p className="w-3/4">Estas datas serão usadas para liberar e encerrar as avaliações dos avaliadores.</p>
          </div>
        </div>
      </DialogComponent>
    </>
  );
}

function DateRow({
  text,
  handleDateChange,
  initOrEnd,
}: {
  text: string;
  handleDateChange: (value: string, type: keyof DateTimeConfiguration) => void;
  initOrEnd: "init" | "end";
}) {
  return (
    <div className="flex items-center justify-between space-x-2">
      <p>{text}</p>
      <div className="space-x-2 flex">
        <input
          type="date"
          onChange={(e) => handleDateChange(e.target.value, `${initOrEnd}Date`)}
          className="border rounded-lg p-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <input
          type="time"
          onChange={(e) => handleDateChange(e.target.value, `${initOrEnd}Time`)}
          className="border rounded-lg p-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>
    </div>
  );
}
