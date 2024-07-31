import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import Spinner from "@/components/Spinner";
import { auth } from "@/lib/firebase/config";
import AvaliaAuthentication from "@/lib/services/auth";
import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const { push, query } = useRouter();

  useEffect(() => {
    let mounted = true;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fairInfo = localStorage.getItem("fairInfo");
        if (fairInfo) {
          push("/admin");
        } else {
          push("/admin/setup");
        }
      } else if (query.email) {
        setErrorMessage(null);
        // try to do login with the link

        (async () => {
          const loginResult = await new AvaliaAuthentication().doLoginWithEmailLink(
            query.email as string,
            window.location.href,
          );

          if (!mounted) {
            return;
          }

          if (loginResult.error) {
            setErrorMessage(loginResult.error);
          } else {
            localStorage.setItem("userInfo", JSON.stringify(loginResult.user));
            localStorage.setItem("refreshToken", JSON.stringify(loginResult.refreshToken));
            push("/admin/setup");
          }
        })();
      } else {
        setErrorMessage("Link inválido ou expirado");
      }
    });

    return () => {
      mounted = false;
    };
  }, [push, query]);

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>Login Administrativo | Avalia</title>
      </Head>
      <HeaderTitle />
      <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center flex items-center justify-center">
        {errorMessage ? <div>{errorMessage}</div> : <Spinner />}
      </div>
      <Footer />
    </main>
  );
}
