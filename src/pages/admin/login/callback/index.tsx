import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import AvaliaAuthentication from "@/lib/services/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const { push, query } = useRouter();

  useEffect(() => {
    let mounted = true;
    const isAuthenticated = new AvaliaAuthentication().isAuthenticated();

    if (isAuthenticated) {
      push("/admin");
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
          push("/admin");
        }
      })();
    } else {
      setErrorMessage("Link inválido ou expirado");
    }

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
        {errorMessage ? (
          <div>{errorMessage}</div>
        ) : (
          <svg width="36" height="36" className="animate-spin" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>spinner</title>
            <path
              fill="#333"
              d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
            />
          </svg>
        )}
      </div>
      <Footer />
    </main>
  );
}
