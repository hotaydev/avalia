import AdminMenu from "@/components/AdminMenu/AdminMenu";
import SortableTable from "@/components/SortableTable/SortableTable";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BsQrCode } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import QRCode from "qrcode";
import type { ProjectForAdmin } from "@/lib/models/project";
import { HotayLogoSVG } from "@/lib/constants/hotay-logo";

export default function AdminProjetosPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectForAdmin[]>([]);
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
          <div id="tableAvailableArea" className="bg-white shadow-md rounded-lg px-4 py-10 w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Projetos cadastrados</h2>
            <SortableTable
              table="projects"
              setPreviousData={setProjects}
              extraComponent={<ExtraComponentForTable projects={projects} />}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function ExtraComponentForTable({ projects }: Readonly<{ projects: ProjectForAdmin[] }>) {
  return (
    <div
      className="mr-4 p-2 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer rounded-md"
      data-tooltip-id="projects-qr-codes"
      data-tooltip-content="Baixar códigos dos projetos"
      onClick={async () => await craftHTMLForThePDF(projects)}
    >
      <BsQrCode size={24} />
      <Tooltip id="projects-qr-codes" />
    </div>
  );
}

async function craftHTMLForThePDF(projects: ProjectForAdmin[]) {
  const logoSVG = HotayLogoSVG;

  const htmlStyles =
    "<style>@page {size: A4;margin: 10mm 5mm;}body {font-family: Arial, sans-serif;margin: 0;padding: 0;display: grid;grid-template-columns: repeat(4, 1fr);grid-template-rows: auto;gap: 5mm;padding: 0;box-sizing: border-box;}.item {border: 1px dotted #ddd;padding: 5mm;text-align: center;page-break-inside: avoid;}.item img {display: block;margin: 0 auto; width: 30mm;}.item svg {width: 12mm;}</style>";

  let htmlItems = "";
  for (const project of projects) {
    const qrcode = await QRCode.toDataURL(project.id.toUpperCase(), {
      errorCorrectionLevel: "M",
      width: 500,
      margin: 3,
    });
    htmlItems += `<div class="item"><img src="${qrcode}" alt="QR Code"><p style="font-weight: bold;">${project.id.toUpperCase()}</p><p style="font-size:8px; color: #888;">Desenvolvido pela</p>${logoSVG}</div>`;
  }

  for (const project of projects) {
    const qrcode = await QRCode.toDataURL(project.id.toUpperCase(), {
      errorCorrectionLevel: "M",
      width: 500,
      margin: 3,
    });
    htmlItems += `<div class="item"><img src="${qrcode}" alt="QR Code"><p style="font-weight: bold;">${project.id.toUpperCase()}</p><p style="font-size:8px; color: #888;">Desenvolvido pela</p>${logoSVG}</div>`;
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
