import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import { auth } from "@/lib/firebase/config";

export default function InviteLoginPage() {
  const [loading, setLoading] = useState(true);
  const [invitedInfo, setInvitedInfo] = useState<{ email?: string; fair?: string }>({});

  const { push, query } = useRouter();

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
        setInvitedInfo({
          email: (query.email as string) ?? "",
          fair: (query.fair as string) ?? "",
        });
        setLoading(false);
      }
    });
  }, [push, query]);

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>Convite Adminstrativo | Avalia</title>
      </Head>
      <HeaderTitle />
      {!loading && (
        <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Você recebeu um convite</h2>
          <div className="px-8 w-full mb-2 flex flex-col text-gray-700">
            <p className="pb-8">
              Você foi convidado para fazer parte da administração da feira
              {invitedInfo.fair ? <strong>{` ${invitedInfo.fair}`}</strong> : ""}.
            </p>
            {invitedInfo.email && (
              <p>
                Use o e-mail <strong>{invitedInfo.email}</strong> para criar sua conta.
              </p>
            )}

            <div className="w-full flex items-center justify-center mt-12">
              <button
                type="button"
                className="text-center w-3/4 rounded-xl outline-hidden py-4 bg-blue-600 hover:bg-blue-700 transition-all border-none text-white text-sm cursor-pointer"
                onClick={() => push("/admin/login")}
              >
                Aceitar convite e criar conta
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}
