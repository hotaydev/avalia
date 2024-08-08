import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { Evaluator } from "@/lib/models/evaluator";
import type { ProjectForAdmin } from "@/lib/models/project";
import type { ScienceFair } from "@/lib/models/scienceFair";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import Select from "react-tailwindcss-select";
import type { Option } from "react-tailwindcss-select/dist/components/type";
import DialogComponent from "../Dialog/Dialog";

export default function AddProjectToEvaluator({ evaluator }: { evaluator: Evaluator }) {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectForAdmin[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<Option | Option[] | null>([]);

  const router = useRouter();

  const getProjects = async (): Promise<ProjectForAdmin[]> => {
    const projectsGetted = localStorage.getItem("projectsList");

    if (projectsGetted) {
      return JSON.parse(projectsGetted);
    }

    const fairInfo: ScienceFair = JSON.parse(localStorage.getItem("fairInfo") ?? "{}");
    return await fetch(`/api/admin/projects/?sheetId=${fairInfo?.spreadsheetId}`)
      .then((res) => {
        if (res.status === 429) {
          throw new Error("Nós evitamos muitas requisições seguidas. Espere um pouco e tente novamente.");
        }
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          return data.data;
        }
        return [];
      })
      .catch((error) => {
        toast.error(error.message);
        return [];
      });
  };

  const openDialog = async (): Promise<void> => {
    setDialogIsOpen(true);
    const projectsGetted = await getProjects();

    const projectsAlreadyFromTheEvaluator: Option[] = [];

    for (const proj of projectsGetted) {
      if (proj.evaluators?.some((ev) => ev.id === evaluator.id)) {
        projectsAlreadyFromTheEvaluator.push({
          value: proj.id.toUpperCase(),
          label: `${proj.title.substring(0, 30)}${proj.title.length > 30 ? "..." : ""} (${proj.id.toUpperCase()})`,
          isSelected: true,
        });
      }
    }

    setSelectedProjects(projectsAlreadyFromTheEvaluator);
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
      .then((res) => {
        if (res.status === 429) {
          throw new Error("Nós evitamos muitas requisições seguidas. Espere um pouco e tente novamente.");
        }
        return res.json();
      })
      .then(async (data: AvaliaApiResponse) => {
        toast.dismiss(toastId);
        if (data.status === "success") {
          toast.success("Projetos atribuídos com sucesso!");

          const newEvaluatorsForLocalStorage = handleProjectsChangesForLocalStoredProjects(projectsIds);
          localStorage.setItem("evaluatorsList", JSON.stringify(newEvaluatorsForLocalStorage));

          await fetch(`/api/admin/projects/?sheetId=${fairInfo?.spreadsheetId}`)
            .then((res) => {
              if (res.status === 429) {
                throw new Error("Nós evitamos muitas requisições seguidas. Espere um pouco e tente novamente.");
              }
              return res.json();
            })
            .then((newProjectData: AvaliaApiResponse) => {
              if (newProjectData.status === "success") {
                localStorage.setItem("projectsList", JSON.stringify(newProjectData.data));
                localStorage.setItem("projectsListLastUpdated", Date.now().toString());
              } else {
                localStorage.removeItem("projectsList");
                localStorage.removeItem("projectsListLastUpdated");
              }

              router.reload();
            })
            .catch((error) => {
              toast.error(error.message);
            });
        } else {
          toast.error(data.message ?? "Não foi possível salvar. Tente novamente mais tarde.");
        }
      })
      .catch((error) => {
        toast.dismiss(toastId);
        toast.error(error.message);
      });
  };

  const handleProjectsChangesForLocalStoredProjects = (projectsIds: string): Evaluator[] => {
    const localEvaluators: Evaluator[] = JSON.parse(localStorage.getItem("evaluatorsList") ?? "[]");
    const newEvaluatorsForLocalStorage: Evaluator[] = [];

    for (const singleEvaluator of localEvaluators) {
      if (singleEvaluator.id === evaluator.id) {
        newEvaluatorsForLocalStorage.push({
          ...singleEvaluator,
          projects: projects.filter((proj) => projectsIds.split(",").includes(proj.id)),
        });
      } else {
        newEvaluatorsForLocalStorage.push(singleEvaluator);
      }
    }

    return newEvaluatorsForLocalStorage;
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
                isSelected: project.evaluators?.some((ev) => ev.id === evaluator.id),
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
