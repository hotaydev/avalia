import DialogComponent from "@/components/Dialog/Dialog";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <HeaderTitle />
      <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Qual área você deseja acessar?
          </h2>
          <div className="space-y-4 px-4">
            <div
              onClick={() => {
                push("/admin");
              }}
              className="bg-gray-100 text-gray-800 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-200 transition-all cursor-pointer group"
            >
              Administração{" "}
              <span className="ml-2 transform group-hover:translate-x-2 transition-transform">
                &rarr;
              </span>
            </div>
            <div
              onClick={() => {
                push("/avaliador");
              }}
              className="bg-gray-100 text-gray-800 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-200 transition-all cursor-pointer group"
            >
              Área do Avaliador{" "}
              <span className="ml-2 transform group-hover:translate-x-2 transition-transform">
                &rarr;
              </span>
            </div>
          </div>
        </div>
        <div
          className="text-center mt-10 font-normal text-sm hover:underline cursor-pointer text-gray-500"
          onClick={() => setOpen(true)}
        >
          Precisa de ajuda?
        </div>
      </div>
      <Footer />
      <DialogComponent
        open={open}
        setOpen={setOpen}
        title="Sobre este sistema"
        content={`O "Avalia" é um sistema criado pela Hotay para ser utilizado nas avaliações de projetos de Feiras de Iniciação Científica. O sistema é livre para qualquer um utilizar e ofere funcionalidades de orquestração de notas a avaliações dos projetos científicos apresentados. Se você quiser usar o sistema e ainda não tiver conta, basta ir para a área de administração que poderá criar uma. Se você é um avaliador, você provavelmente terá recebido um link de acessou ou um código de acesso. Com ele você pode acessar os trabalhos que irá avaliar sem precisar fazer nenhum tipo de login.`}
      />
    </main>
  );
}
