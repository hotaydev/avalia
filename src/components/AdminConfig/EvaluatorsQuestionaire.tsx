import { useState } from "react";
import DialogComponent from "../Dialog/Dialog";
import ConfigItem from "./ConfigItem";

export default function EvaluatorsQuestionaire() {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      <ConfigItem text="Questionário dos avaliadores" onClick={() => setDialogIsOpen(true)} />
      <DialogComponent open={dialogIsOpen} setOpen={setDialogIsOpen} title="Questionário padrão em uso">
        Por enquanto estamos utilizando um questionário padrão para o avaliadores. Em breve você poderá editar as
        perguntas que os avaliadores devem responder.
      </DialogComponent>
    </>
  );
}
