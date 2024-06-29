import { signIn } from "next-auth/react";
import ArrowBack from "@/components/ArrowBack/ArrowBack";
import DialogComponent from "@/components/Dialog/Dialog";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FcLink } from "react-icons/fc";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";

const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export default function AdminPage() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const validateEmail = (val: string): boolean => {
    if (val.match(isValidEmail)) {
      return true;
    }
    return false;
  };

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>Login Administrativo | Avalia</title>
      </Head>
      <Toaster />
      <HeaderTitle />
      <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Como deseja acessar sua conta?
        </h2>
        <div className="px-4">
          <div className="w-full mb-2 flex flex-col">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="border px-4 py-2 rounded-lg w-full h-12 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
            {email !== "" && !validateEmail(email) && (
              <span className="w-full text-left text-red-600 text-xs font-light ml-1 pt-1 mb-2">
                Email inválido
              </span>
            )}
          </div>
          <div
            onClick={async () => {
              if (email !== "" && validateEmail(email)) {
                // TODO: set a "loading" state
                await signIn("nodemailer", {
                  email: email,
                });
              } else {
                toast.error("Preencha corretamente o seu email.");
              }
            }}
            className="bg-gray-100 text-gray-800 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-200 transition-all cursor-pointer group"
          >
            <FcLink />
            Receber link por e-mail{" "}
            <span className="ml-2 transform group-hover:translate-x-2 transition-transform">
              &rarr;
            </span>
          </div>
          <p className="text-gray-500 font-light text-sm my-4">- ou -</p>
          <div
            onClick={async () => {
              // TODO: add "loading" animation
              await signIn("google");
            }}
            className="bg-gray-100 text-gray-800 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-200 transition-all cursor-pointer group"
          >
            <FcGoogle />
            Login com Google{" "}
            <span className="ml-2 transform group-hover:translate-x-2 transition-transform">
              &rarr;
            </span>
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
