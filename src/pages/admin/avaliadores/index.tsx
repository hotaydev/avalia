import AdminMenu from "@/components/AdminMenu/AdminMenu";
import DialogComponent from "@/components/Dialog/Dialog";
import SortableTable from "@/components/SortableTable/SortableTable";
import { auth } from "@/lib/firebase/config";
import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { Evaluator } from "@/lib/models/evaluator";
import type { ScienceFair } from "@/lib/models/scienceFair";
import { getLastTime } from "@/lib/utils/lastUpdateTime";
import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import { type NextRouter, useRouter } from "next/router";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GoPlus } from "react-icons/go";
import { IoReload } from "react-icons/io5";
import { Tooltip } from "react-tooltip";

export default function AdminAvaliadoresPage() {
  const [loading, setLoading] = useState(true);
  const [fairInfo, setFairInfo] = useState<ScienceFair | undefined>();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("userInfo", JSON.stringify(user));
        const _fairInfo = localStorage.getItem("fairInfo");
        if (_fairInfo) {
          setFairInfo(JSON.parse(_fairInfo));
          setLoading(false);
        } else {
          router.push("/admin/setup");
        }
      } else {
        router.push("/admin/login");
      }
    });
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
          <div id="tableAvailableArea" className="bg-white shadow-md rounded-lg px-4 py-10 w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Lista de Avaliadores</h2>
            <SortableTable
              table="evaluators"
              extraComponent={<ExtraComponentForTable router={router} fairInfo={fairInfo} />}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function ExtraComponentForTable({ router, fairInfo }: { router: NextRouter; fairInfo?: ScienceFair }) {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  const updateTableContent = async () => {
    const toastId = toast.loading("Atualizando lista...");
    if (!fairInfo?.spreadsheetId) {
      toast.error("O link da planilha de dados ainda não foi configurado. Vá para a página de configuração.");
      return;
    }
    await fetch(`/api/admin/evaluators/?sheetId=${fairInfo?.spreadsheetId}`)
      .then((res) => res.json())
      .then((data: AvaliaApiResponse) => {
        toast.dismiss(toastId);
        if (data.status === "success") {
          localStorage.setItem("evaluatorsList", JSON.stringify(data.data));
          localStorage.setItem("evaluatorsListLastUpdated", Date.now().toString());
          router.reload();
        } else {
          toast.error(data.message ?? "Não foi possível atualizar a lista de avaliadores. Tente novamente mais tarde.");
        }
      });
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <div className="mr-2 text-xs font-light text-gray-500">
          Última atualização há {getLastTime("evaluatorsListLastUpdated")}
        </div>
        <div
          className="mr-2 p-2 bg-white hover:bg-gray-100 transition-all cursor-pointer rounded-md"
          onClick={updateTableContent}
        >
          <IoReload size={20} />
        </div>
      </div>
      <div
        className="mr-4 p-2 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer rounded-md"
        data-tooltip-id="add-new-evaluator-to-list"
        data-tooltip-content="Adicionar novo avaliador"
        data-tooltip-place="left"
        onClick={() => setDialogIsOpen(true)}
      >
        <GoPlus size={20} />
        <Tooltip id="add-new-evaluator-to-list" />
      </div>
      <NewEvaluatorModalContent
        dialogIsOpen={dialogIsOpen}
        setDialogIsOpen={setDialogIsOpen}
        fairInfo={fairInfo}
        router={router}
      />
    </div>
  );
}

function NewEvaluatorModalContent({
  dialogIsOpen,
  setDialogIsOpen,
  fairInfo,
  router,
}: {
  dialogIsOpen: boolean;
  setDialogIsOpen: Dispatch<SetStateAction<boolean>>;
  fairInfo?: ScienceFair;
  router: NextRouter;
}) {
  const [evaluatorName, setEvaluatorName] = useState("");
  const [evaluatorEmail, setEvaluatorEmail] = useState("");
  const [evaluatorPhone, setEvaluatorPhone] = useState("");
  const [evaluatorArea, setEvaluatorArea] = useState("");

  const sendData = async (): Promise<void> => {
    if (!evaluatorName) {
      toast.error("O nome do avaliador é a única informação estritamente necessária.");
      return;
    }

    if (!fairInfo?.spreadsheetId) {
      toast.error("O link da planilha de dados ainda não foi configurado. Vá para a página de configuração.");
      return;
    }

    // TODO: validate email/phone

    const toastId = toast.loading("Criando avaliador...");
    await fetch("/api/admin/evaluators/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sheetId: fairInfo?.spreadsheetId,
        evaluatorName,
        evaluatorEmail,
        evaluatorPhone,
        evaluatorArea,
      }),
    })
      .then((res) => res.json())
      .then(async (data: AvaliaApiResponse) => {
        toast.dismiss(toastId);
        if (data.status === "success") {
          // data.data is the ID of the created evaluator
          toast.success("Avaliador criado com sucesso!");

          const evaluatorsList: Evaluator[] = JSON.parse(localStorage.getItem("evaluatorsList") ?? "[]");
          evaluatorsList.push({
            id: data.data as string,
            name: evaluatorName,
            email: evaluatorEmail,
            phone: evaluatorPhone,
            field: evaluatorArea,
            projects: [],
          });
          localStorage.setItem("evaluatorsList", JSON.stringify(evaluatorsList));

          await new Promise((r) => setTimeout(r, 1600)); // sleep
          router.reload();
        } else {
          toast.error(data.message ?? "Não foi possível salvar o avaliador. Tente novamente mais tarde.");
        }
      });
  };

  return (
    <DialogComponent
      open={dialogIsOpen}
      setOpen={setDialogIsOpen}
      title={"Adicionar Novo Avaliador"}
      buttonText="Salvar"
      onClick={sendData}
    >
      <div className="w-full">
        <div>
          <hr />
        </div>
        <p className="ml-1 mb-1 font-semibold text-gray-600 mt-4">Nome:</p>
        <input
          value={evaluatorName}
          onChange={(e) => setEvaluatorName(e.target.value)}
          type="text"
          placeholder="Ex. Pessoa Exemplo"
          className="p-2 border border-gray-300 rounded-lg w-full"
        />

        <p className="ml-1 mb-1 font-semibold text-gray-600 mt-4">Email:</p>
        <input
          value={evaluatorEmail}
          onChange={(e) => setEvaluatorEmail(e.target.value)}
          type="text"
          placeholder="Ex. pessoa@email.com"
          className="p-2 border border-gray-300 rounded-lg w-full"
        />

        <p className="ml-1 mb-1 font-semibold text-gray-600 mt-4">Telefone/WhatsApp:</p>
        <input
          value={evaluatorPhone}
          onChange={(e) => setEvaluatorPhone(e.target.value)}
          type="text"
          placeholder="Ex. (51) 99999-9999"
          className="p-2 border border-gray-300 rounded-lg w-full"
        />

        <p className="ml-1 mb-1 font-semibold text-gray-600 mt-4">Área de atuação:</p>
        <input
          value={evaluatorArea}
          onChange={(e) => setEvaluatorArea(e.target.value)}
          type="text"
          placeholder="Ex. Tecnologia e Biologia"
          className="p-2 border border-gray-300 rounded-lg w-full"
        />

        <div className="w-full text-center flex items-center justify-center pt-8 font-light text-xs">
          O email e o número de contato serão utilizado para facilitar o envio de convites. A área de atuação é útil
          para escolher os projetos para o avaliador. Nenhuma dessas informações é obrigatória.
        </div>
      </div>
    </DialogComponent>
  );
}
