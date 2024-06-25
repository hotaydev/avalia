import ArrowBack from "@/components/ArrowBack/ArrowBack";
import AvaliadorCode from "@/components/AvaliadorCode/AvaliadorCode";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";

export default function Login() {
  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <HeaderTitle />
      <div className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-10">
            Qual seu código de avaliador?
          </h2>
          <AvaliadorCode />
        </div>
        <div className="text-center mt-10 font-normal text-sm hover:underline cursor-pointer text-gray-500">
          Precisa de ajuda?
        </div>
      </div>
      <Footer />
      <ArrowBack />
    </main>
  );
}
