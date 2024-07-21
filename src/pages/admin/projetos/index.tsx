import AdminMenu from "@/components/AdminMenu/AdminMenu";
import SortableTable from "@/components/SortableTable/SortableTable";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BsQrCode } from "react-icons/bs";
import { Tooltip } from "react-tooltip";

export default function AdminProjetosPage() {
  const [loading, setLoading] = useState(true);
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
            <SortableTable table="projects" extraComponent={<ExtraComponentForTable />} />
          </div>
        </div>
      )}
    </main>
  );
}

function ExtraComponentForTable() {
  return (
    <div
      className="mr-4 p-2 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer rounded-md"
      data-tooltip-id="projects-qr-codes"
      data-tooltip-content="Baixar códigos dos projetos"
    >
      <BsQrCode size={24} />
      <Tooltip id="projects-qr-codes" />
    </div>
  );
}
