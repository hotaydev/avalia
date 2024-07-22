import { useState } from "react";
import ConfigItem from "./ConfigItem";
import DialogComponent from "../Dialog/Dialog";

export default function EventDates() {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      <ConfigItem text="Datas da Feira" onClick={() => setDialogIsOpen(true)} />
      <DialogComponent
        open={dialogIsOpen}
        setOpen={setDialogIsOpen}
        title="Configurar Datas da Feira"
        buttonText="Salvar alterações"
      >
        Conteúdo a ser implementado.
      </DialogComponent>
    </>
  );
}
