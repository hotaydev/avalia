import Link from "next/link";
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
        <div className="flex flex-col pr-6 mb-2 w-full mt-4">
          <SingleSheet />
          <div className="w-full text-center flex items-center justify-center pt-8 font-light text-xs">
            {/* TODO: ajustar link */}
            {/* TODO: Criar planilha de template, contendo "avaliadores", "projetos", "respostas" e "categorias" */}
            <Link href={"https://github.com/hotaydev/avalia/wiki"} target="_blank" className="w-3/4">
              Clique aqui para instruções completas da configuração.
            </Link>
          </div>
        </div>
      </DialogComponent>
    </>
  );
}

// TODO: Adicionar icones de ajuda para entender o que são as "abas"
function SingleSheet() {
  return (
    <div className="w-full">
      <div>
        <p className="ml-1 mb-1 font-semibold text-gray-600">Instruções:</p>
        <p className="ml-1 mb-1 font-light text-gray-500 text-sm">
          1. Copie{" "}
          <Link
            href={`https://docs.google.com/spreadsheets/d/${process.env.NEXT_PUBLIC_SPREADSHEET_TEMPLATE_ID}/template/preview`}
            target="_blank"
            className="text-blue-500 font-semibold"
          >
            esta planilha de modelo
          </Link>
          .
        </p>
        <p className="ml-1 mb-1 font-light text-gray-500 text-sm">
          2. Compartilhe a planilha com o{" "}
          <Link
            href={"https://github.com/hotaydev/avalia/wiki"}
            target="_blank"
            className="text-blue-500 font-semibold"
          >
            email citado aqui
          </Link>
          .
        </p>
        <p className="ml-1 mb-1 font-light text-gray-500 text-sm pl-4">
          a{")"} Dê <strong>permissão de edição</strong> ao email citado.
        </p>
        <p className="ml-1 mb-1 font-light text-gray-500 text-sm">3. Copie o link da planilha.</p>
        <p className="ml-1 mb-1 font-light text-gray-500 text-sm">4. Cole o link copiado no campo a baixo.</p>
      </div>

      <p className="ml-1 mb-1 font-semibold text-gray-600 mt-8">Link da Planilha do Google:</p>
      <input
        type="text"
        placeholder="Ex. https://docs.google.com/spreadsheets/d/xxxxxx/edit"
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
    </div>
  );
}
