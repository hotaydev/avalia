import { useState } from "react";
import DialogComponent from "../Dialog/Dialog";

export default function AddEvaluatorToProject() {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      <span
        onClick={() => setDialogIsOpen(true)}
        className="py-1 px-2 ml-2 bg-gray-200 rounded-sm hover:bg-gray-300 cursor-pointer transition-all font-light text-gray-700"
      >
        ?
      </span>
      <DialogComponent
        open={dialogIsOpen}
        setOpen={setDialogIsOpen}
        title={"Informação importante"}
        buttonText="Entendido"
      >
        <p>Para adicionar um avaliador à este projeto, acesse a página "Avaliadores" e adicione por lá.</p>
        <p className="mt-6">Futuramente você poderá fazer isso por aqui também.</p>
      </DialogComponent>
    </>
  );
}
