import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { Evaluator } from "@/lib/models/evaluator";
import type { ProjectForAdmin } from "@/lib/models/project";
import type { ScienceFair } from "@/lib/models/scienceFair";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import DialogComponent from "../Dialog/Dialog";

export default function AddProjectToEvaluator({ evaluator }: { evaluator: Evaluator }) {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectForAdmin[]>([]);
  const [selectedProjectsIds, setSelectedProjectsIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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

        const response = res.json();
        localStorage.setItem("projectsList", JSON.stringify(response));
        return response;
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

    const projectsAlreadyFromTheEvaluator: string[] = [];

    for (const proj of projectsGetted) {
      if (proj.evaluators?.some((ev) => ev.id === evaluator.id)) {
        projectsAlreadyFromTheEvaluator.push(proj.id);
      }
    }

    setSelectedProjectsIds(projectsAlreadyFromTheEvaluator);
    setProjects(projectsGetted);
  };

  const sendData = async () => {
    if (selectedProjectsIds.length === 0) {
      return;
    }

    const toastId = toast.loading("Salvando informações...");
    const projectsIds = selectedProjectsIds.join(",");

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

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjectsIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    );
  };

  const filterAndSortProjects = () => {
    // Filter projects based on search term
    const filtered = projects.filter(
      (project) =>
        searchTerm === "" ||
        project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Sort projects: selected first, then alphabetically by title
    return filtered.sort((a, b) => {
      // If searching, just sort alphabetically
      if (searchTerm !== "") {
        return a.title.localeCompare(b.title);
      }

      // If not searching, selected projects first, then alphabetically
      const aSelected = selectedProjectsIds.includes(a.id);
      const bSelected = selectedProjectsIds.includes(b.id);

      if (aSelected && !bSelected) {
        return -1;
      }
      if (!aSelected && bSelected) {
        return 1;
      }
      return a.title.localeCompare(b.title);
    });
  };

  return (
    <>
      <span
        onClick={openDialog}
        className="py-1 px-2 ml-2 bg-gray-200 rounded-sm hover:bg-gray-300 cursor-pointer transition-all font-light text-gray-700"
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
        <div style={{ height: "calc(100vh / 2)" }} className="flex flex-col">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por ID ou título do projeto..."
              className="w-full p-2 border border-gray-300 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-y-auto">
            {filterAndSortProjects().length === 0 && (
              <div className="text-center py-4 text-gray-500">Nenhum projeto encontrado para sua busca.</div>
            )}
            {filterAndSortProjects().map((project) => (
              <div
                key={project.id}
                onClick={() => toggleProjectSelection(project.id)}
                className={`
                    flex items-center p-2 mb-2 rounded cursor-pointer transition-colors border
                    ${selectedProjectsIds.includes(project.id) ? "bg-blue-100 border-blue-300 hover:bg-blue-200" : "hover:bg-blue-50 border-gray-200"}
                  `}
              >
                <div
                  className={`
                    w-5 h-5 rounded-full border mr-3 flex items-center justify-center
                    ${
                      selectedProjectsIds.includes(project.id)
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-400"
                    }
                  `}
                >
                  {selectedProjectsIds.includes(project.id) && <span>&#x2713;</span>}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{project.title}</p>
                  <p className="text-sm text-gray-500">ID: {project.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogComponent>
    </>
  );
}
