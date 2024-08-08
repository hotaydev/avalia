import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import { useState } from "react";
import toast from "react-hot-toast";
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
  const [dateConfig, setDateConfig] = useState<DateTimeConfiguration>({});
  const [alreadySavedInfo, setAlreadySavedInfo] = useState<{ start?: string; end?: string }>({});

  const handleDateChange = (value: string, type: keyof DateTimeConfiguration): void => {
    setDateConfig((prevConfig) => ({
      ...prevConfig,
      [type]: value,
    }));
  };

  const saveDates = async () => {
    const toastId = toast.loading("Salvando informações...");

    const fairId = JSON.parse(localStorage.getItem("fairInfo") ?? "{}").fairId;
    await fetch(
      `/api/admin/fairs/time/?fairId=${fairId}&initDate=${dateConfig.initDate}&endDate=${dateConfig.endDate}&initTime=${dateConfig.initTime}&endTime=${dateConfig.endTime}`,
    )
      .then((res) => {
        if (res.status === 429) {
          throw new Error("Nós evitamos muitas requisições seguidas. Espere um pouco e tente novamente.");
        }
        return res.json();
      })
      .then((data: AvaliaApiResponse) => {
        toast.dismiss(toastId);
        if (data.status === "success") {
          toast.success("Datas salvas com sucesso!");
          updateFairDataLocally(dateConfig);
          setDateConfig({});
        } else {
          toast.error(data.message ?? "Algo deu errado na hora de salvar. Tente novamente mais tarde.");
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const updateFairDataLocally = (dates: DateTimeConfiguration) => {
    const fairInfo = JSON.parse(localStorage.getItem("fairInfo") ?? "{}");

    const startDateString = dates.initDate ? `${dates.initDate}T${dates.initTime ?? "00:00"}:00.000-03:00` : "";
    const endDateString = dates.endDate ? `${dates.endDate}T${dates.endTime ?? "00:00"}:00.000-03:00` : "";

    localStorage.setItem(
      "fairInfo",
      JSON.stringify({
        ...fairInfo,
        startDate: startDateString,
        endDate: endDateString,
      }),
    );
  };

  const addZeroToDate = (date: number): string => {
    if (date < 10) {
      return `0${date}`;
    }
    return date.toString();
  };

  const openDialog = () => {
    const fairInfo = JSON.parse(localStorage.getItem("fairInfo") ?? "{}");

    let startDate = "";
    let endDate = "";

    if (fairInfo?.startDate) {
      const date = new Date(fairInfo.startDate);
      startDate = `${addZeroToDate(date.getDate())}/${addZeroToDate(date.getMonth())}/${date.getFullYear()} - ${addZeroToDate(date.getHours())}h${addZeroToDate(date.getMinutes())}`;
    }

    if (fairInfo?.endDate) {
      const date = new Date(fairInfo.endDate);
      endDate = `${addZeroToDate(date.getDate())}/${addZeroToDate(date.getMonth())}/${date.getFullYear()} - ${addZeroToDate(date.getHours())}h${addZeroToDate(date.getMinutes())}`;
    }

    setAlreadySavedInfo({
      start: startDate,
      end: endDate,
    });

    setDialogIsOpen(true);
  };

  return (
    <>
      <ConfigItem text="Datas da Feira" onClick={openDialog} />
      <DialogComponent
        open={dialogIsOpen}
        setOpen={setDialogIsOpen}
        titleCentered={true}
        title="Configurar Datas da Feira"
        buttonText="Salvar alterações"
        onClick={saveDates}
      >
        <div className="flex space-y-4 px-6 flex-col mt-8 mb-2 w-full">
          {/* TODO: this date configuration is really bad, see some way to make it easier */}
          <div>
            {alreadySavedInfo.start && (
              <p className="font-semibold text-blue-500">
                Data de início configurada: <span className="text-gray-500">{alreadySavedInfo.start}</span>
              </p>
            )}
            {alreadySavedInfo.end && (
              <p className="font-semibold text-blue-500">
                Data de término configurada: <span className="text-gray-500">{alreadySavedInfo.end}</span>
              </p>
            )}
          </div>
          {(alreadySavedInfo.start || alreadySavedInfo.end) && (
            <strong className="pb-8 pt-6 underline decoration-red-500">
              Apenas edite os campos a baixo se precisar alterar as datas definidas acima.
            </strong>
          )}

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
