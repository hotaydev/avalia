import AdminMenu from "@/components/AdminMenu/AdminMenu";
import SortableTable from "@/components/SortableTable/SortableTable";
import { HotayLogoSvg } from "@/lib/constants/hotay-logo";
import { auth } from "@/lib/firebase/config";
import type { ProjectForAdmin } from "@/lib/models/project";
import { getLastTime } from "@/lib/utils/lastUpdateTime";
import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import { type NextRouter, useRouter } from "next/router";
import qrCode from "qrcode";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BsQrCode } from "react-icons/bs";
import { IoReload } from "react-icons/io5";
import { Tooltip } from "react-tooltip";

export default function AdminProjetosPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectForAdmin[]>([]);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fairInfo = localStorage.getItem("fairInfo");
        if (fairInfo) {
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
              extraComponent={<ExtraComponentForTable projects={projects} router={router} />}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function ExtraComponentForTable({ projects, router }: Readonly<{ projects: ProjectForAdmin[]; router: NextRouter }>) {
  const updateTableContent = async () => {
    fetch("/api/admin/projects/")
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("projectsList", JSON.stringify(data));
        localStorage.setItem("projectsListLastUpdated", Date.now().toString());
        router.reload();
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
        data-tooltip-id="projects-qr-codes"
        data-tooltip-content="Baixar códigos dos projetos"
        data-tooltip-place="left"
        onClick={async () => await craftHtmlForThePdf(projects)}
      >
        <BsQrCode size={24} />
        <Tooltip id="projects-qr-codes" />
      </div>
    </div>
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
