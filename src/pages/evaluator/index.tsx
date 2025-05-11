import ArrowBack from "@/components/ArrowBack/ArrowBack";
import EvaluatorCode from "@/components/EvaluatorCode/EvaluatorCode";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import Spinner from "@/components/Spinner";
import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { ScienceFair } from "@/lib/models/scienceFair";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function EvaluatorLogin() {
  const { push, query } = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // We aren't using "pathname" from router because it needs some time to load, it would be another refresh inside the useEffect
    if (window.location.href.includes("?code=")) {
      // If this value is an empty array, it means that the useEffect will refresh when it's fullfilled
      if (query?.code) {
        const { evaluatorCode, fairCode } = getCodeFromLink(query.code as string);

        if (evaluatorCode && fairCode) {
          (async () => {
            await fetch(`/api/auth/fairs/?fairId=${fairCode}`)
              .then((res) => {
                if (res.status === 429) {
                  throw new Error("Nós evitamos muitas requisições seguidas. Espere um pouco e tente novamente.");
                }
                return res.json();
              })
              .then(async (fairResponse: AvaliaApiResponse) => {
                if (mounted) {
                  await handleScienceFairApiResult(fairResponse, evaluatorCode);
                }
              })
              .catch((error) => {
                toast.error(error.message);
                setLoading(false);
              });
          })();
        } else {
          setLoading(false);
        }
      }
    } else {
      setStateOrRedirectBasedOnCurrentInfoFromLocalStorage();
    }

    () => {
      mounted = false;
    };
  }, [query]);

  const handleScienceFairApiResult = async (fairResponse: AvaliaApiResponse, evaluatorCode: string) => {
    if (fairResponse.status === "success") {
      await getEvaluatorDataAfterScienceFair(fairResponse.data as ScienceFair, evaluatorCode);
    } else {
      toast.error(fairResponse.message ?? "Não foi possível encontrar a feira para a qual você foi convidado.");
      setLoading(false);
    }
  };

  const getEvaluatorDataAfterScienceFair = async (fairInfo: ScienceFair, evaluatorCode: string) => {
    await fetch(`/api/auth/evaluator/?sheetId=${fairInfo.spreadsheetId}&code=${evaluatorCode.toUpperCase()}`)
      .then((res) => {
        if (res.status === 429) {
          throw new Error("Nós evitamos muitas requisições seguidas. Espere um pouco e tente novamente.");
        }
        return res.json();
      })
      .then((evaluatorResponse: AvaliaApiResponse) => {
        // evaluatorResponse.data will be true if the evaluator was found
        if (evaluatorResponse.status === "success" && evaluatorResponse.data) {
          localStorage.setItem("evaluator", JSON.stringify(evaluatorResponse.data));
          localStorage.setItem("fairInfo", JSON.stringify(fairInfo));
          localStorage.setItem("evaluatorLastUpdated", Date.now().toString());

          push("/evaluator/projects");
        } else {
          toast.error(evaluatorResponse.message ?? "Não encontramos o seu convite para a feira informada pelo link.");
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  };

  const setStateOrRedirectBasedOnCurrentInfoFromLocalStorage = () => {
    const evaluator = localStorage.getItem("evaluator");
    const fairInfo = localStorage.getItem("fairInfo");

    if (evaluator && fairInfo) {
      push("/evaluator/projects");
    } else if (evaluator) {
      push("/evaluator/fair");
    } else {
      setLoading(false);
    }
  };

  const getCodeFromLink = (link: string): { evaluatorCode: string; fairCode: string } => {
    const codeInPieces = (link as string).split("-");

    const evaluatorCode = codeInPieces.shift();
    const fairCode = codeInPieces.join("-");

    return { evaluatorCode: evaluatorCode as string, fairCode };
  };

  const handleLogin = (code: string): void => {
    localStorage.setItem("evaluatorCode", code.toUpperCase());
    push("/evaluator/fair");
  };

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>Login do Avaliador | Avalia</title>
      </Head>
      <Toaster />
      {loading ? (
        <div className="w-full h-96 flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <HeaderTitle />
          <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-10">Qual seu código de avaliador?</h2>
            <EvaluatorCode callback={handleLogin} />
            <div className="text-center mt-10 font-normal text-sm hover:underline cursor-pointer text-gray-500">
              Precisa de ajuda?
            </div>
          </div>
          <Footer />
          <ArrowBack route="/" />
        </>
      )}
    </main>
  );
}
