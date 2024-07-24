import AdminMenu from "@/components/AdminMenu/AdminMenu";
import SortableTable from "@/components/SortableTable/SortableTable";
import { getLastTime } from "@/lib/utils/lastUpdateTime";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { IoReload } from "react-icons/io5";
import { Tooltip } from "react-tooltip";

export default function AdminAvaliadoresPage() {
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Lista de Avaliadores</h2>
            <SortableTable table="evaluators" extraComponent={<ExtraComponentForTable />} />
          </div>
        </div>
      )}
    </main>
  );
}

function ExtraComponentForTable() {
  return (
    <div className="flex items-center">
      <div
        className="mr-4 p-2 bg-white hover:bg-gray-100 transition-all cursor-pointer rounded-md"
        data-tooltip-id="reload-projects-list"
        data-tooltip-content={`Última atualização há ${getLastTime("evaluatorsListLastUpdated")}`}
        data-tooltip-place="left"
      >
        <IoReload size={18} />
        <Tooltip id="reload-projects-list" />
      </div>
    </div>
  );
}
