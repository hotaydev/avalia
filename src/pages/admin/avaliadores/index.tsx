import Head from "next/head";
import { Toaster } from "react-hot-toast";
import AdminMenu from "@/components/AdminMenu/AdminMenu";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
          <div className="bg-white shadow-md rounded-lg px-4 py-10 w-full text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Lista de Avaliadores
            </h2>
          </div>
        </div>
      )}
    </main>
  );
}
