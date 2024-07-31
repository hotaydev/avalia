import ConfigOptions from "@/components/AdminConfig/ConfigOptions";
import AdminMenu from "@/components/AdminMenu/AdminMenu";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function AdminConfigPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
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
          <div className="bg-white shadow-md rounded-lg px-4 py-10 w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Configurações</h2>
            <div className="w-full max-w-2xl m-auto mb-6">
              <hr />
            </div>
            <ConfigOptions />
          </div>
        </div>
      )}
    </main>
  );
}
