import type { Evaluator } from "@/lib/models/evaluator";
import type { ProjectForEvaluator } from "@/lib/models/project";
import { useState } from "react";
import DialogComponent from "../Dialog/Dialog";

export default function AddProjectToEvaluator({ evaluator }: { evaluator: Evaluator }) {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectForEvaluator[]>([]);
  // TODO: os projetos podem ser pegos localmente usando o localStorage e, se não estiverem no localStorage, fazer o fetch.
  // Detalhe: Não usar useEffect, ou ele carregaria todos os dados para todos os avaliadores (consumo excessivo de memória)

  const getProjects = async (): Promise<ProjectForEvaluator[]> => {
    const _projects = localStorage.getItem("projectsList");

    if (_projects) {
      return JSON.parse(_projects);
    }

    return await fetch("/api/admin/projects/")
      .then((res) => res.json())
      .then(async (data) => {
        return data;
      });
  };

  const handleClick = async (): Promise<void> => {
    // Abre primeiro o modal e depois carrega os projetos, para que seja mostrado primeiramente um loader e, após, trocado o estado
    setDialogIsOpen(true);
    const _projects = await getProjects();
    setProjects(_projects);
  };

  return (
    <>
      <span
        onClick={handleClick}
        className="py-1 px-2 ml-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer transition-all font-light text-gray-700"
      >
        +
      </span>
      <DialogComponent
        open={dialogIsOpen}
        setOpen={setDialogIsOpen}
        title={`Selecione os projetos para ${evaluator.name.split(" ")[0]}`}
      >
        Texto Exemplo. Iterar os projetos.
      </DialogComponent>
    </>
  );
}
