import AdminMenu from "@/components/AdminMenu/AdminMenu";
import DialogComponent from "@/components/Dialog/Dialog";
import SortableTable from "@/components/SortableTable/SortableTable";
import { HotayLogoSvg } from "@/lib/constants/hotay-logo";
import { auth } from "@/lib/firebase/config";
import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { ProjectForAdmin } from "@/lib/models/project";
import type { ScienceFair } from "@/lib/models/scienceFair";
import { getLastTime } from "@/lib/utils/lastUpdateTime";
import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import { type NextRouter, useRouter } from "next/router";
import qrCode from "qrcode";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BsQrCode } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { IoReload } from "react-icons/io5";
import { Tooltip } from "react-tooltip";

export default function AdminProjetosPage() {
  const [loading, setLoading] = useState(true);
  const [fairInfo, setFairInfo] = useState<ScienceFair | undefined>();
  const [projects, setProjects] = useState<ProjectForAdmin[]>([]);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("userInfo", JSON.stringify(user));
        const _fairInfo = localStorage.getItem("fairInfo");
        if (_fairInfo) {
          setFairInfo(JSON.parse(localStorage.getItem("fairInfo") ?? "{}"));
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Projetos cadastrados</h2>
            <SortableTable
              table="projects"
              setPreviousData={setProjects}
              extraComponent={<ExtraComponentForTable projects={projects} router={router} fairInfo={fairInfo} />}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function ExtraComponentForTable({
  projects,
  router,
  fairInfo,
}: Readonly<{ projects: ProjectForAdmin[]; router: NextRouter; fairInfo?: ScienceFair }>) {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  const updateTableContent = async () => {
    const toastId = toast.loading("Atualizando lista...");

    if (!fairInfo?.spreadsheetId) {
      toast.error("O link da planilha de dados ainda não foi configurado. Vá para a página de configuração.");
      return;
    }

    await fetch(`/api/admin/projects/?sheetId=${fairInfo?.spreadsheetId}`)
      .then((res) => res.json())
      .then((data: AvaliaApiResponse) => {
        toast.dismiss(toastId);
        if (data.status === "success") {
          localStorage.setItem("projectsList", JSON.stringify(data.data));
          localStorage.setItem("projectsListLastUpdated", Date.now().toString());
          router.reload();
        } else {
          toast.error(data.message ?? "Não foi possível atualizar a lista de projetos. Tente novamente mais tarde.");
        }
      });
  };

  return (
    <div className="flex items-center">
      <div
        className="mr-4 p-2 bg-white hover:bg-gray-100 transition-all cursor-pointer rounded-md"
        data-tooltip-id="reload-projects-list"
        data-tooltip-content={`Última atualização há ${getLastTime("projectsListLastUpdated")}`}
        data-tooltip-place="left"
        onClick={updateTableContent}
      >
        <IoReload size={18} />
        <Tooltip id="reload-projects-list" />
      </div>
      <div
        className="mr-4 p-2 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer rounded-md"
        data-tooltip-id="add-new-project-to-list"
        data-tooltip-content="Adicionar novo projeto"
        data-tooltip-place="left"
        onClick={() => setDialogIsOpen(true)}
      >
        <GoPlus size={24} />
        <Tooltip id="add-new-project-to-list" />
      </div>
      <div
        className="mr-4 p-2 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer rounded-md"
        data-tooltip-id="projects-qr-codes"
        data-tooltip-content="Baixar códigos dos projetos"
        data-tooltip-place="left"
        onClick={async () => await craftHtmlForThePdf(projects)}
      >
        <BsQrCode size={24} />
        <Tooltip id="projects-qr-codes" />
      </div>
      <NewProjectModalContent
        dialogIsOpen={dialogIsOpen}
        setDialogIsOpen={setDialogIsOpen}
        fairInfo={fairInfo}
        router={router}
      />
    </div>
  );
}

function NewProjectModalContent({
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
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectCategory, setProjectCategory] = useState("");
  const [projectArea, setProjectArea] = useState("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: We don't want to "retrigger" this useEffect when availableCategories changes, it would cause an infinite loop
  useEffect(() => {
    let mounted = true;

    if (fairInfo?.spreadsheetId && availableCategories.length === 0) {
      (async () => {
        await fetch(`/api/admin/fairs/categories/?sheetId=${fairInfo?.spreadsheetId}`)
          .then((res) => res.json())
          .then((data: AvaliaApiResponse) => {
            if (mounted && data.status === "success") {
              setAvailableCategories(data.data as string[]);
            }
          });
      })();
    }

    return () => {
      mounted = false;
    };
  }, [fairInfo]);

  const sendData = async (): Promise<void> => {
    if (!(projectName && projectCategory)) {
      toast.error("Apenas a descrição e a área podem ser deixadas em branco.");
      return;
    }

    if (!fairInfo?.spreadsheetId) {
      toast.error("O link da planilha de dados ainda não foi configurado. Vá para a página de configuração.");
      return;
    }

    const toastId = toast.loading("Criando projeto...");
    await fetch("/api/admin/projects/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sheetId: fairInfo?.spreadsheetId,
        projectName,
        projectDescription,
        projectCategory,
        projectArea,
      }),
    })
      .then((res) => res.json())
      .then(async (data: AvaliaApiResponse) => {
        toast.dismiss(toastId);
        if (data.status === "success") {
          // data.data is the ID of the created evaluator
          toast.success("Projeto criado com sucesso!");

          const localProjectsList: ProjectForAdmin[] = JSON.parse(localStorage.getItem("projectsList") ?? "[]");
          localProjectsList.push({
            id: data.data as string,
            title: projectName,
            description: projectDescription,
            category: projectCategory,
            field: projectArea,
            score: 0,
            evaluators: [],
          });
          localStorage.setItem("projectsList", JSON.stringify(localProjectsList));

          await new Promise((r) => setTimeout(r, 1600)); // sleep
          router.reload();
        } else {
          toast.error(data.message ?? "Não foi possível salvar o projeto. Tente novamente mais tarde.");
        }
      });
  };

  return (
    <DialogComponent
      open={dialogIsOpen}
      setOpen={setDialogIsOpen}
      title={"Adicionar Novo Projeto"}
      buttonText="Salvar"
      onClick={sendData}
    >
      <div className="w-full">
        <div>
          <hr />
        </div>
        <p className="ml-1 mb-1 font-semibold text-gray-600 mt-4">Título:</p>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          type="text"
          placeholder="Ex. Criação de sistema para feiras"
          className="p-2 border border-gray-300 rounded-lg w-full"
        />

        <p className="ml-1 mb-1 font-semibold text-gray-600 mt-4">Descrição:</p>
        <input
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          type="text"
          placeholder="Ex. Este projeto visa ..."
          className="p-2 border border-gray-300 rounded-lg w-full"
        />

        <p className="ml-1 mb-1 font-semibold text-gray-600 mt-4">Categoria:</p>
        <select
          className="p-2 border border-gray-300 rounded-lg w-full"
          value={projectCategory}
          onChange={(e) => setProjectCategory(e.target.value)}
        >
          <option value="" disabled={true}>
            Escolha a categoria
          </option>
          {availableCategories.map((categorie) => {
            return (
              <option key={categorie} value={categorie}>
                {categorie}
              </option>
            );
          })}
        </select>

        <p className="ml-1 mb-1 font-semibold text-gray-600 mt-4">Área do projeto:</p>
        <input
          value={projectArea}
          onChange={(e) => setProjectArea(e.target.value)}
          type="text"
          placeholder="Ex. Tecnologia ou Biologia"
          className="p-2 border border-gray-300 rounded-lg w-full"
        />

        <div className="w-full text-center flex items-center justify-center pt-8 font-light text-xs">
          Apenas a descrição e a área podem ficar em branco. Para editar um projeto, acesse a planílha de fonte de
          dados, encontrada na aba de "Configuração";
        </div>
      </div>
    </DialogComponent>
  );
}

async function craftHtmlForThePdf(projects: ProjectForAdmin[]) {
  const logoSvg = HotayLogoSvg;

  const htmlStyles =
    "<style>@page {size: A4;margin: 10mm 5mm;}body {font-family: Arial, sans-serif;margin: 0;padding: 0;display: grid;grid-template-columns: repeat(4, 1fr);grid-template-rows: auto;gap: 5mm;padding: 0;box-sizing: border-box;}.item {border: 1px dotted #ddd;padding: 5mm;text-align: center;page-break-inside: avoid;}.item img {display: block;margin: 0 auto; width: 30mm;}.item svg {width: 12mm;}</style>";

  let htmlItems = "";
  for (const project of projects) {
    const qrcode = await qrCode.toDataURL(project.id.toUpperCase(), {
      errorCorrectionLevel: "M",
      width: 500,
      margin: 3,
    });
    htmlItems += `<div class="item"><img src="${qrcode}" alt="QR Code"><p style="font-weight: semi-bold; font-size: 12px;">${project.title}</p><p style="font-weight: bold;">${project.id.toUpperCase()}</p><p style="font-size:8px; color: #888;">Desenvolvido pela</p>${logoSvg}</div>`;
  }

  const htmlContent = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Códigos dos Projetos da Feira</title>${htmlStyles}</head><body onafterprint="self.close()">${htmlItems}</body></html>`;

  printContent(htmlContent);
}

function printContent(content: string) {
  const mywindow = window.open("", "_blank");

  if (mywindow) {
    mywindow.document.open();
    mywindow.document.write(content);
    mywindow.document.close();

    mywindow.onload = () => {
      mywindow.print();
    };
  } else {
    console.error("Failed to open new window.");
  }
}
