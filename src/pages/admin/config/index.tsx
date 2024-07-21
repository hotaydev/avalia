import AdminMenu from "@/components/AdminMenu/AdminMenu";
import DialogComponent from "@/components/Dialog/Dialog";
import Head from "next/head";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function AdminConfigPage() {
  const [loading, setLoading] = useState(true);
  const [questionareDialogIsOpen, setQuestionareDialogIsOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // TODO: use a real auth method
    const adminCode = localStorage.getItem("adminCode");

    if (!adminCode) {
      router.push("/admin/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  return (
    <main className="z-10 flex flex-col relative px-10 py-10 h-screen">
      <Head>
        <title>Administração | Avalia</title>
      </Head>
      <Toaster />
      {!loading && (
        <div className="flex w-full gap-x-8 h-screen">
          <AdminMenu path={router.pathname} pushRoute={router.push} />
          <div className="bg-white shadow-md rounded-lg px-4 py-10 w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Configurações</h2>
            <div className="w-full max-w-2xl m-auto mb-6">
              <hr />
            </div>
            <ConfigOptions setQuestionaireOpen={setQuestionareDialogIsOpen} />
            <EvaluatorsQuestionaireNotAvailable open={questionareDialogIsOpen} setOpen={setQuestionareDialogIsOpen} />
          </div>
        </div>
      )}
    </main>
  );
}

function EvaluatorsQuestionaireNotAvailable({
  open,
  setOpen,
}: Readonly<{ open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }>) {
  return (
    <DialogComponent open={open} setOpen={setOpen} title="Questionário padrão em uso">
      Por enquanto estamos utilizando um questionário padrão para o avaliadores. Em breve você poderá editar as
      perguntas que os avaliadores devem responder.
    </DialogComponent>
  );
}

function ConfigOptions({ setQuestionaireOpen }: Readonly<{ setQuestionaireOpen: Dispatch<SetStateAction<boolean>> }>) {
  return (
    <div className="space-y-3 flex flex-col justify-center items-center">
      <ConfigItem text="Fontes de Dados" />
      <ConfigItem text="Datas da Feira" />
      <ConfigItem text="Questionário dos avaliadores" onClick={() => setQuestionaireOpen(true)} />
      <ConfigItem text="Página de Cadastro de Avaliadores" soon={true} />
      <ConfigItem text="Página de Cadastro de Projetos" soon={true} />
    </div>
  );
}

function ConfigItem({ text, soon = false, onClick }: Readonly<{ text: string; soon?: boolean; onClick?: () => void }>) {
  return (
    <div
      className={`bg-gray-100 text-gray-800 rounded-lg py-3 flex items-center justify-between ${soon ? "cursor-not-allowed pr-6 pl-2" : "hover:bg-gray-200 cursor-pointer px-6"} transition-all w-full max-w-lg group`}
      onClick={onClick}
    >
      {soon ? <span className="px-2 py-1 bg-gray-300 rounded-md font-light text-xs">Em breve</span> : <span />}
      {text}{" "}
      <span className={`ml-2 transform transition-transform ${soon ? "" : "group-hover:translate-x-2"}`}>&rarr;</span>
    </div>
  );
}
