import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import DialogComponent from "@/components/Dialog/Dialog";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";

export default function Login() {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>Avalia | Sistema de avaliações para feiras</title>
      </Head>
      <HeaderTitle />
      <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Qual área você deseja acessar?</h2>
        <div className="space-y-4 px-4">
          <div
            onClick={() => {
              push("/admin/login");
            }}
            className="bg-gray-100 text-gray-800 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-200 transition-all cursor-pointer group"
          >
            Administração <span className="ml-2 transform group-hover:translate-x-2 transition-transform">&rarr;</span>
          </div>
          <div
            onClick={() => {
              push("/evaluator");
            }}
            className="bg-gray-100 text-gray-800 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-200 transition-all cursor-pointer group"
          >
            Área do Avaliador{" "}
            <span className="ml-2 transform group-hover:translate-x-2 transition-transform">&rarr;</span>
          </div>
        </div>
        <div
          className="text-center mt-10 font-normal text-sm hover:underline cursor-pointer text-gray-500"
          onClick={() => setOpen(true)}
        >
          Precisa de ajuda?
        </div>
      </div>
      <div className="max-w-lg w-full mb-8 flex justify-center gap-3">
        <a
          href="https://www.youtube.com/watch?v=h-MU76Wc4E8"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm hover:bg-red-200 hover:text-red-700 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Assista nosso vídeo tutorial</title>
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
          </svg>
          Assista nosso vídeo tutorial
        </a>
        <a
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-200 hover:text-gray-700 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Documentação</title>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          Documentação
        </a>
      </div>
      <Footer />
      <DialogComponent open={open} setOpen={setOpen} title="Sobre este sistema">
        O Avalia é um sistema criado pela Hotay para ser utilizado nas avaliações de projetos de Feiras de Iniciação
        Científica.
        <br />O sistema é livre para qualquer um utilizar e oferece funcionalidades de orquestração de notas e
        avaliações dos projetos científicos apresentados.
        <br />
        Se você quiser usar o sistema e ainda não tiver conta, basta ir para a área de administração que poderá criar
        uma.
        <br />
        Se você é um avaliador, você provavelmente terá recebido um link de acesso ou um código de acesso. Com ele você
        pode acessar os trabalhos que irá avaliar sem precisar fazer nenhum tipo de login.
      </DialogComponent>
    </main>
  );
}
