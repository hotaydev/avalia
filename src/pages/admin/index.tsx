import ArrowBack from "@/components/ArrowBack/ArrowBack";
import DialogComponent from "@/components/Dialog/Dialog";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FcLink } from "react-icons/fc";

export default function AdminPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <HeaderTitle />
      <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Como deseja acessar sua conta?
          </h2>
          <div className="space-y-4 px-4">
            <div
              // onClick={() => {
              //   push("/admin");
              // }}
              className="bg-gray-100 text-gray-800 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-200 transition-all cursor-pointer group"
            >
              <FcGoogle />
              Login com Google{" "}
              <span className="ml-2 transform group-hover:translate-x-2 transition-transform">
                &rarr;
              </span>
            </div>
            <div
              // onClick={() => {
              //   push("/avaliador");
              // }}
              className="bg-gray-100 text-gray-800 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-200 transition-all cursor-pointer group"
            >
              <FcLink />
              Receber link por e-mail{" "}
              <span className="ml-2 transform group-hover:translate-x-2 transition-transform">
                &rarr;
              </span>
            </div>
          </div>
        </div>
        <div className="text-center mt-10 font-normal text-sm text-gray-500">
          As opções acima permitem acessar{" "}
          <strong>
            uma conta
            <br />
            existente
          </strong>{" "}
          ou <strong>criar uma nova</strong>.
        </div>
        <div
          className="text-center mt-5 font-normal text-sm hover:underline cursor-pointer text-gray-500"
          onClick={() => setOpen(true)}
        >
          Por que não usamos senhas?
        </div>
      </div>
      <Footer />
      <ArrowBack />
      <DialogComponent
        open={open}
        setOpen={setOpen}
        title="Por que não usamos senhas?"
      >
        A segurança de uma senha é fácil de ser burlada. Processos de
        autorização e login sem senha passam a camada de segurança diretamente
        para o Google ou seu e-mail.
        <br />
        <br />
        Acaba sendo uma senha a menos para se lembrar e um processo de
        autorização mais seguro.
      </DialogComponent>
    </main>
  );
}
