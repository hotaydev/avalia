import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminInitialSetupPage() {
  const [loading, setLoading] = useState(true);
  const [fairSchool, setFairSchool] = useState("");
  const [fairName, setFairName] = useState("");
  const [sendingInformation, setSendingInformation] = useState<boolean>(false);

  const { push } = useRouter();

  useEffect(() => {
    // TODO: use a real auth method
    const adminCode = localStorage.getItem("adminCode");

    if (adminCode) {
      setLoading(false);
    } else {
      push("/admin/login");
    }
  }, [push]);

  const sendData = async () => {
    const toastId = toast.loading("Salvando informações...");
    setSendingInformation(true);

    await fetch("/api/auth/fairs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fairSchool,
        fairName,
        adminEmail: "", // TODO: get this info from user authentication provider
      }),
    })
      .then((res) => res.json())
      .then((data: AvaliaApiResponse) => {
        toast.dismiss(toastId);
        if (data.status === "success") {
          // TODO: get fair information based in the ID, and save all info from the fair, not only the ID
          localStorage.setItem("fairId", data.data as string);
          push("/admin");
        } else {
          toast.error(data.message ?? "Ocorreu algum problema. Tente novamente mais tarde.");
          setSendingInformation(false);
        }
      });
  };

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>Configuração de Conta | Avalia</title>
      </Head>
      <Toaster />
      <HeaderTitle />
      {!loading && (
        <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Vamos configurar sua conta</h2>
          <div className="text-center font-normal text-sm text-gray-500 mb-8">
            Vamos criar sua conta de escola/feira científica, onde você será o administrador. Após isso, você poderá
            convidar outros usuários.
          </div>
          <div className="px-4">
            <div className="w-full mb-4 flex flex-col">
              <p className="text-left font-semibold text-gray-500 text-xs ml-1 pb-1">Nome da Escola / Organização</p>
              <input
                type="text"
                value={fairSchool}
                onChange={(e) => setFairSchool(e.target.value)}
                placeholder={'Ex. "EEEM exemplo" ou "Fundação exemplo"'}
                className="border px-4 py-2 rounded-lg w-full h-12 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
              />
            </div>
            <div className="w-full flex flex-col">
              <p className="text-left font-semibold text-gray-500 text-xs ml-1 pb-1">Nome da feira</p>
              <input
                type="text"
                value={fairName}
                onChange={(e) => setFairName(e.target.value)}
                placeholder={'Ex. "Mostratec" ou "Feira da escola exemplo"'}
                className="border px-4 py-2 rounded-lg w-full h-12 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
              />
            </div>

            <button
              type="button"
              className="text-center w-3/4 rounded-xl outline-none py-4 bg-blue-600 hover:bg-blue-700 transition-all border-none text-white text-sm disabled:bg-gray-400 disabled:hover:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring focus:ring-blue-300 mt-10"
              disabled={fairSchool.length < 5 || fairName.length < 4 || sendingInformation}
              onClick={sendData}
            >
              Concluir configuração
            </button>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}
