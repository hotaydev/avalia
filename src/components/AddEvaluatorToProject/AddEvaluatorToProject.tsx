import type { Evaluator } from "@/lib/models/evaluator";
import type { ProjectForAdmin } from "@/lib/models/project";
import { useState } from "react";
import Select from "react-tailwindcss-select";
import type { SelectValue } from "react-tailwindcss-select/dist/components/type";
import DialogComponent from "../Dialog/Dialog";

export default function AddEvaluatorToProject({ project }: { project: ProjectForAdmin }) {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [selectedEvaluators, setSelectedEvaluators] = useState<SelectValue>([]);

  const getEvaluators = async (): Promise<Evaluator[]> => {
    const evaluatorGetted = localStorage.getItem("evaluatorsList");

    if (evaluatorGetted) {
      return JSON.parse(evaluatorGetted);
    }

    return await fetch("/api/admin/evaluators/")
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
  };

  const openDialog = async (): Promise<void> => {
    // Abre primeiro o modal e depois carrega os projetos, para que seja mostrado primeiramente um loader e, após, trocado o estado
    setDialogIsOpen(true);
    const evaluatorGetted = await getEvaluators();
    setEvaluators(evaluatorGetted);
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
        title={`Selecione os avaliadores para o projeto ${project.id}`}
        buttonText="Salvar"
      >
        <div style={{ height: "calc(100vh * 0.5)" }}>
          <p className="py-1">Selecione a baixo:</p>
          <Select
            primaryColor="blue"
            value={selectedEvaluators}
            onChange={(val) => setSelectedEvaluators(val)}
            options={evaluators.map((evaluator) => {
              return { value: evaluator.id.toUpperCase(), label: `${evaluator.name} (${evaluator.id.toUpperCase()})` };
            })}
            isMultiple={true}
            isSearchable={true}
            placeholder="Selecione..."
            searchInputPlaceholder="Buscar avaliadores"
            noOptionsMessage="Nenhum avaliador encontrado."
          />
        </div>
      </DialogComponent>
    </>
  );
}
