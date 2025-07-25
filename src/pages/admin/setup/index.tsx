import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import Spinner from "@/components/Spinner";
import { auth } from "@/lib/firebase/config";
import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import AvaliaAuthentication from "@/lib/services/auth";

export default function AdminInitialSetupPage() {
  const [loading, setLoading] = useState(true);
  const [fairSchool, setFairSchool] = useState("");
  const [fairName, setFairName] = useState("");
  const [sendingInformation, setSendingInformation] = useState<boolean>(false);

  const { push } = useRouter();

  useEffect(() => {
    let mounted = true;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("userInfo", JSON.stringify(user));
        const fairInfo = localStorage.getItem("fairInfo");
        if (fairInfo) {
          push("/admin");
        } else {
          (async () => {
            await fetch(`/api/auth/fairs/?email=${user.email}`) // used to get info from the fair
              .then((res) => {
                if (res.status === 429) {
                  throw new Error("Nós evitamos muitas requisições seguidas. Espere um pouco e tente novamente.");
                }
                return res.json();
              })
              .then((data: AvaliaApiResponse) => {
                if (mounted) {
                  handleFairsApiResult(data);
                }
              })
              .catch((error) => {
                toast.error(error.message);
              });
          })();
        }
      } else {
        push("/admin/login");
      }
    });

    return () => {
      mounted = false;
    };
  }, [push]);

  const handleFairsApiResult = (data: AvaliaApiResponse) => {
    if (data.status === "success" && data.data) {
      localStorage.setItem("fairInfo", JSON.stringify(data.data));
      push("/admin");
    } else {
      setLoading(false);
    }
  };

  const sendData = async () => {
    setSendingInformation(true);
    const toastId = toast.loading("Salvando informações...");

    await fetch("/api/auth/fairs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fairSchool,
        fairName,
        adminEmail: auth.currentUser?.email,
      }),
    })
      .then((res) => {
        if (res.status === 429) {
          throw new Error("Nós evitamos muitas requisições seguidas. Espere um pouco e tente novamente.");
        }
        return res.json();
      })
      .then(async (data: AvaliaApiResponse) => {
        if (data.status === "success") {
          await fetch(`/api/auth/fairs/?fairId=${data.data}`)
            .then((res) => {
              if (res.status === 429) {
                throw new Error("Nós evitamos muitas requisições seguidas. Espere um pouco e tente novamente.");
              }
              return res.json();
            })
            .then((data: AvaliaApiResponse) => {
              if (data.status === "success" && data.data) {
                localStorage.setItem("fairInfo", JSON.stringify(data.data));
                toast.dismiss(toastId);
                push("/admin");
              } else {
                toast.dismiss(toastId);
                toast.error(data.message ?? "Ocorreu algum problema. Tente novamente mais tarde.");
                setSendingInformation(false);
              }
            })
            .catch((error) => {
              toast.dismiss(toastId);
              setSendingInformation(false);
              toast.error(error.message);
            });
        } else {
          toast.dismiss(toastId);
          toast.error(data.message ?? "Ocorreu algum problema. Tente novamente mais tarde.");
          setSendingInformation(false);
        }
      })
      .catch((error) => {
        toast.dismiss(toastId);
        setSendingInformation(false);
        toast.error(error.message);
      });
  };

  const handleLogout = () => {
    new AvaliaAuthentication().logout();
    push("/admin/login");
  };

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>Configuração de Conta | Avalia</title>
      </Head>
      <Toaster />
      <HeaderTitle />
      {loading ? (
        <div className="bg-white shadow-md rounded-lg px-4 pt-12 py-12 max-w-lg w-full text-center flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
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
                className="border px-4 py-2 rounded-lg w-full h-12 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
              />
            </div>
            <div className="w-full flex flex-col">
              <p className="text-left font-semibold text-gray-500 text-xs ml-1 pb-1">Nome da feira</p>
              <input
                type="text"
                value={fairName}
                onChange={(e) => setFairName(e.target.value)}
                placeholder={'Ex. "Mostratec" ou "Feira da escola exemplo"'}
                className="border px-4 py-2 rounded-lg w-full h-12 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
              />
            </div>

            <button
              type="button"
              className="text-center w-3/4 rounded-xl outline-hidden py-4 bg-blue-600 hover:bg-blue-700 transition-all border-none text-white text-sm disabled:bg-gray-400 disabled:hover:bg-gray-500 disabled:cursor-not-allowed focus:outline-hidden focus:ring-3 focus:ring-blue-300 mt-10 cursor-pointer"
              disabled={fairSchool.length < 5 || fairName.length < 4 || sendingInformation}
              onClick={sendData}
            >
              Concluir configuração
            </button>
          </div>
        </div>
      )}
      <div className="static md:fixed md:top-2 md:right-6">
        <span
          className="px-6 rounded-full cursor-pointer font-light text-sm hover:underline transition-all text-gray-600"
          onClick={handleLogout}
        >
          <span className="hidden md:block pr-5">Cancelar criação de conta</span>
          <span className="block md:hidden">Cancelar</span>
        </span>
      </div>
      <Footer />
    </main>
  );
}
