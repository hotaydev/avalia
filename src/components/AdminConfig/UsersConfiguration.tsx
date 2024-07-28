import { useState } from "react";
import DialogComponent from "../Dialog/Dialog";
import ConfigItem from "./ConfigItem";

export default function UsersConfiguration() {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      <ConfigItem text="Gerenciar usuários administrativos" onClick={() => setDialogIsOpen(true)} />
      <DialogComponent open={dialogIsOpen} setOpen={setDialogIsOpen} title="Lista de usuários">
        <div className="flex">
          <input
            type="text"
            className="w-3/4 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
            placeholder="Email do novo usuário..."
          />
          <button
            type="button"
            className="w-1/4 p-2 bg-blue-500 text-white transition-all rounded-r-lg hover:bg-blue-600"
          >
            Convidar
          </button>
        </div>
      </DialogComponent>
    </>
  );
}
