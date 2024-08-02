import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { Evaluator } from "@/lib/models/evaluator";
import type { ProjectForEvaluator } from "@/lib/models/project";
import type { ScienceFair } from "@/lib/models/scienceFair";
import { useState } from "react";
import toast from "react-hot-toast";
import Select from "react-tailwindcss-select";
import type { Option } from "react-tailwindcss-select/dist/components/type";
import DialogComponent from "../Dialog/Dialog";

export default function AddProjectToEvaluator({ evaluator }: { evaluator: Evaluator }) {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectForEvaluator[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<Option | Option[] | null>([]);

  const getProjects = async (): Promise<ProjectForEvaluator[]> => {
    const projectsGetted = localStorage.getItem("projectsList");

    if (projectsGetted) {
      return JSON.parse(projectsGetted);
    }

    const fairInfo: ScienceFair = JSON.parse(localStorage.getItem("fairInfo") ?? "{}");
    return await fetch(`/api/admin/projects/?sheetId=${fairInfo?.spreadsheetId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          // TODO: save also this information to the project on localStorage
          return data.data;
        }
        return [];
      });
  };

  const openDialog = async (): Promise<void> => {
    // Abre primeiro o modal e depois carrega os projetos, para que seja mostrado primeiramente um loader e, após, trocado o estado
    setDialogIsOpen(true);
    const projectsGetted = await getProjects();
    setProjects(projectsGetted);
  };

  const sendData = async () => {
    if (!Array.isArray(selectedProjects)) {
      return;
    }

    if (selectedProjects.length === 0) {
      return;
    }

    const toastId = toast.loading("Salvando informações...");
    const projectsIds = selectedProjects.map((project) => project.value).join(",");

    const fairInfo: ScienceFair = JSON.parse(localStorage.getItem("fairInfo") ?? "{}");

    await fetch(
      `/api/admin/fairs/link/?evaluator=${evaluator.id}&projects=${projectsIds}&sheetId=${fairInfo?.spreadsheetId}`,
    )
      .then((res) => res.json())
      .then(async (data: AvaliaApiResponse) => {
        toast.dismiss(toastId);
        if (data.status === "success") {
          // TODO: save also this information to the project on localStorage
          toast.success("Projetos atribuídos com sucesso!");
          await new Promise((r) => setTimeout(r, 2000)); // wait 2 seconds
        } else {
          toast.error(data.message ?? "Não foi possível salvar. Tente novamente mais tarde.");
        }
      });
  };

  return (
    <>
      <span
        onClick={openDialog}
        className="py-1 px-2 ml-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer transition-all font-light text-gray-700"
      >
        +
      </span>
      <DialogComponent
        open={dialogIsOpen}
        setOpen={setDialogIsOpen}
        title={`Selecione os projetos para ${evaluator.name.split(" ")[0]}`}
        buttonText="Salvar"
        onClick={sendData}
      >
        <div style={{ height: "calc(100vh * 0.5)" }}>
          <p className="py-1">Selecione a baixo:</p>
          <Select
            primaryColor="blue"
            value={selectedProjects}
            onChange={(val) => setSelectedProjects(val)}
            options={projects.map((project) => {
              return {
                value: project.id.toUpperCase(),
                label: `${project.title.substring(0, 30)}${project.title.length > 30 ? "..." : ""} (${project.id.toUpperCase()})`,
              };
            })}
            isMultiple={true}
            isSearchable={true}
            placeholder="Selecione..."
            searchInputPlaceholder="Buscar projetos"
            noOptionsMessage="Nenhum projeto encontrado."
          />
        </div>
      </DialogComponent>
    </>
  );
}
