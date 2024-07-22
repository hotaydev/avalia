import { useState } from "react";
import ConfigItem from "./ConfigItem";
import DialogComponent from "../Dialog/Dialog";

export default function SheetsData() {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      <ConfigItem text="Fontes de Dados" onClick={() => setDialogIsOpen(true)} />
      <DialogComponent
        open={dialogIsOpen}
        setOpen={setDialogIsOpen}
        title="Configurar Fontes de Dados"
        buttonText="Salvar alterações"
      >
        Conteúdo a ser implementado.
      </DialogComponent>
    </>
  );
}
