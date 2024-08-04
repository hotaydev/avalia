import ArrowBack from "@/components/ArrowBack/ArrowBack";
import AvaliadorCode from "@/components/AvaliadorCode/AvaliadorCode";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Login() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: verify if the evaluatorCode is really from an evaluator
    const evaluatorCode = localStorage.getItem("evaluatorCode");

    if (evaluatorCode) {
      push("/avaliador/projetos");
    } else {
      setLoading(false);
    }
  }, [push]);

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
      {!loading && (
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
