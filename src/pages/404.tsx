import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import Head from "next/head";
import { useRouter } from "next/router";

// This page will work only in production, using the `npm run start`.

export default function NotFoundPage() {
  const { push } = useRouter();

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>404 - Página não encontrada</title>
      </Head>
      <HeaderTitle />
      <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">404 | Página não encontrada</h2>
        <p className="text-gray-600">
          Talvez essa página nunca existiu ou então foi alterada recentemente para melhorias na plataforma.
        </p>
        <div className="px-4 mt-10 mb-4 w-full flex items-center justify-center">
          <div
            className="bg-gray-100 text-gray-800 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-200 transition-all cursor-pointer group w-3/4"
            onClick={() => {
              push("/");
            }}
          >
            Voltar à página principal
            <span className="ml-2 transform group-hover:translate-x-2 transition-transform">&rarr;</span>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
