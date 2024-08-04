import ArrowBack from "@/components/ArrowBack/ArrowBack";
import DialogComponent from "@/components/Dialog/Dialog";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import { auth } from "@/lib/firebase/config";
import AvaliaAuthentication from "@/lib/services/auth";
import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FcLink } from "react-icons/fc";

const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

// TODO: disable button click on email link loading
export default function AdminLoginPage() {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailLinkSent, setEmailLinkSent] = useState<boolean>(false);

  const { push } = useRouter();

  const validateEmail = (val: string): boolean => {
    if (val.match(isValidEmail)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("userInfo", JSON.stringify(user));
        const fairInfo = localStorage.getItem("fairInfo");
        if (fairInfo) {
          push("/admin");
        } else {
          push("/admin/setup");
        }
      } else {
        setLoading(false);
      }
    });
  }, [push]);

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>Login Administrativo | Avalia</title>
      </Head>
      <Toaster />
      <HeaderTitle />
      {!(loading || emailLinkSent) && (
        <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Como deseja acessar sua conta?</h2>
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
                <span className="w-full text-left text-red-600 text-xs font-light ml-1 pt-1 mb-2">Email inválido</span>
              )}
            </div>
            <div
              onClick={async () => {
                if (email !== "" && validateEmail(email)) {
                  const toastId = toast.loading("Enviando link por email...");
                  const userResult = await new AvaliaAuthentication().sendLoginEmailWithLink(email);

                  if (userResult.success) {
                    toast.dismiss(toastId);
                    setEmailLinkSent(true);
                  } else {
                    toast.error(
                      userResult.message ?? "Não foi possível enviar o e-mail de login. Tente novamente mais tarde.",
                    );
                  }
                } else {
                  toast.error("Preencha corretamente o seu email.");
                }
              }}
              className="bg-gray-100 text-gray-800 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-200 transition-all cursor-pointer group"
            >
              <FcLink />
              Receber link por e-mail{" "}
              <span className="ml-2 transform group-hover:translate-x-2 transition-transform">&rarr;</span>
            </div>
            <p className="text-gray-500 font-light text-sm my-4">- ou -</p>
            <div
              onClick={async () => {
                const userResult = await new AvaliaAuthentication().doLoginWithGoogle();

                if (userResult.error) {
                  toast.error(userResult.error);
                } else {
                  localStorage.setItem("userInfo", JSON.stringify(userResult.user) ?? "");

                  push("/admin/setup");
                }
              }}
              className="bg-gray-100 text-gray-800 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-200 transition-all cursor-pointer group"
            >
              <FcGoogle />
              Login com Google{" "}
              <span className="ml-2 transform group-hover:translate-x-2 transition-transform">&rarr;</span>
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
      )}
      {emailLinkSent && (
        <div className="bg-white shadow-md rounded-lg px-8 pb-12 pt-6 mb-12 max-w-lg w-full text-center">
          <p className="w-full flex items-center justify-center flex-col mb-8">
            <svg
              className="w-1/3"
              enableBackground="new 0 0 512 512"
              version="1.1"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Success Icon</title>
              <path
                fill="#2BB673"
                d="M489,255.9c0-0.2,0-0.5,0-0.7c0-1.6,0-3.2-0.1-4.7c0-0.9-0.1-1.8-0.1-2.8c0-0.9-0.1-1.8-0.1-2.7  c-0.1-1.1-0.1-2.2-0.2-3.3c0-0.7-0.1-1.4-0.1-2.1c-0.1-1.2-0.2-2.4-0.3-3.6c0-0.5-0.1-1.1-0.1-1.6c-0.1-1.3-0.3-2.6-0.4-4  c0-0.3-0.1-0.7-0.1-1C474.3,113.2,375.7,22.9,256,22.9S37.7,113.2,24.5,229.5c0,0.3-0.1,0.7-0.1,1c-0.1,1.3-0.3,2.6-0.4,4  c-0.1,0.5-0.1,1.1-0.1,1.6c-0.1,1.2-0.2,2.4-0.3,3.6c0,0.7-0.1,1.4-0.1,2.1c-0.1,1.1-0.1,2.2-0.2,3.3c0,0.9-0.1,1.8-0.1,2.7  c0,0.9-0.1,1.8-0.1,2.8c0,1.6-0.1,3.2-0.1,4.7c0,0.2,0,0.5,0,0.7c0,0,0,0,0,0.1s0,0,0,0.1c0,0.2,0,0.5,0,0.7c0,1.6,0,3.2,0.1,4.7  c0,0.9,0.1,1.8,0.1,2.8c0,0.9,0.1,1.8,0.1,2.7c0.1,1.1,0.1,2.2,0.2,3.3c0,0.7,0.1,1.4,0.1,2.1c0.1,1.2,0.2,2.4,0.3,3.6  c0,0.5,0.1,1.1,0.1,1.6c0.1,1.3,0.3,2.6,0.4,4c0,0.3,0.1,0.7,0.1,1C37.7,398.8,136.3,489.1,256,489.1s218.3-90.3,231.5-206.5  c0-0.3,0.1-0.7,0.1-1c0.1-1.3,0.3-2.6,0.4-4c0.1-0.5,0.1-1.1,0.1-1.6c0.1-1.2,0.2-2.4,0.3-3.6c0-0.7,0.1-1.4,0.1-2.1  c0.1-1.1,0.1-2.2,0.2-3.3c0-0.9,0.1-1.8,0.1-2.7c0-0.9,0.1-1.8,0.1-2.8c0-1.6,0.1-3.2,0.1-4.7c0-0.2,0-0.5,0-0.7  C489,256,489,256,489,255.9C489,256,489,256,489,255.9z"
                id="XMLID_3_"
              />
              <g id="XMLID_1_">
                <line
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={30}
                  strokeMiterlimit={10}
                  x1="213.6"
                  x2="369.7"
                  y1="344.2"
                  y2="188.2"
                />
                <line
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={30}
                  strokeMiterlimit={10}
                  x1="233.8"
                  x2="154.7"
                  y1="345.2"
                  y2="266.1"
                />
              </g>
            </svg>
          </p>
          Link de acesso enviado ao seu e-mail. Clique no link no seu e-mail para prosseguir com o acesso à sua conta.
        </div>
      )}
      <Footer />
      <ArrowBack />
      <DialogComponent open={open} setOpen={setOpen} title="Por que não usamos senhas?">
        A segurança de uma senha é fácil de ser burlada. Processos de autorização e login sem senha passam a camada de
        segurança diretamente para o Google ou seu e-mail.
        <br />
        <br />
        Acaba sendo uma senha a menos para se lembrar e um processo de autorização mais seguro.
      </DialogComponent>
    </main>
  );
}
