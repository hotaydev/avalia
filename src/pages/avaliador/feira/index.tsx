import ArrowBack from "@/components/ArrowBack/ArrowBack";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import Head from "next/head";

export default function ChooseFair() {
  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>Login do Avaliador | Avalia</title>
      </Head>
      <HeaderTitle />
      <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-10">Para qual feira você foi convidado?</h2>
      </div>
      {/* TODO: create this page */}
      <Footer />
      <ArrowBack />
    </main>
  );
}
