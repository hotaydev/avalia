import { useState } from "react";
import DialogComponent from "../Dialog/Dialog";
import ConfigItem from "./ConfigItem";

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
