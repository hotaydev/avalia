import ArrowBack from "@/components/ArrowBack/ArrowBack";
import AvaliadorCode from "@/components/AvaliadorCode/AvaliadorCode";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import Spinner from "@/components/Spinner";
import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { ScienceFair } from "@/lib/models/scienceFair";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const { push, query } = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // We aren't using "pathname" from router because it needs some time to load, it would be another refresh inside the useEffect
    if (window.location.href.includes("?code=")) {
      // If this value is an empty array, it means that the useEffect will refresh when it's fullfilled
      if (query?.code) {
        const codeInPieces = (query.code as string).split("-");

        const evaluatorCode = codeInPieces.shift();
        const fairCode = codeInPieces.join("-");

        if (evaluatorCode && fairCode) {
          (async () => {
            await fetch(`/api/auth/fairs/?fairId=${fairCode}`)
              .then((res) => res.json())
              .then(async (fairResponse: AvaliaApiResponse) => {
                if (fairResponse.status === "success") {
                  const fairInfo = fairResponse.data as ScienceFair;

                  if (!mounted) {
                    return;
                  }

                  await fetch(`/api/auth/evaluator/?sheetId=${fairInfo.spreadsheetId}&code=${evaluatorCode}`)
                    .then((res) => res.json())
                    .then((evaluatorResponse: AvaliaApiResponse) => {
                      if (mounted) {
                        // evaluatorResponse.data will be true if the evaluator was found
                        if (evaluatorResponse.status === "success" && evaluatorResponse.data) {
                          localStorage.setItem("evaluator", JSON.stringify(evaluatorResponse.data));
                          localStorage.setItem("fairInfo", JSON.stringify(fairInfo));

                          push("/avaliador/projetos");
                        } else {
                          toast.error(
                            evaluatorResponse.message ??
                              "Não encontramos o seu convite para a feira informada pelo link.",
                          );
                          setLoading(false);
                        }
                      }
                    });
                } else {
                  toast.error(
                    fairResponse.message ?? "Não foi possível encontrar a feira para a qual você foi convidado.",
                  );
                  setLoading(false);
                }
              });
          })();
        } else {
          setLoading(false);
        }
      }
    } else {
      const evaluator = localStorage.getItem("evaluator");
      const fairInfo = localStorage.getItem("fairInfo");

      if (evaluator && fairInfo) {
        push("/avaliador/projetos");
      } else if (evaluator) {
        push("/avaliador/feira");
      } else {
        setLoading(false);
      }
    }

    () => {
      mounted = false;
    };
  }, [push, query]);

  const handleLogin = (code: string): void => {
    // TODO: implement login logic for evaluators

    // NOTA: se o avaliador não fizer login pelo link direto, nós não sabemos para qual feira ele foi convidado.
    //       por isso, pedimos o código e logo depois pedimos para ele escolher entre as feiras existentes. Se
    //       o código dele estiver na planilha da feira, significa que ele foi convidado (tem acesso).
    localStorage.setItem("evaluatorCode", code);
    push("/avaliador/projetos");
  };

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>Login do Avaliador | Avalia</title>
      </Head>
      <Toaster />
      {loading ? (
        <div className="w-full h-screen flex pb-20 justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <HeaderTitle />
          <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-10">Qual seu código de avaliador?</h2>
            <AvaliadorCode callback={handleLogin} />
            <div className="text-center mt-10 font-normal text-sm hover:underline cursor-pointer text-gray-500">
              Precisa de ajuda?
            </div>
          </div>
          <Footer />
          <ArrowBack />
        </>
      )}
    </main>
  );
}
