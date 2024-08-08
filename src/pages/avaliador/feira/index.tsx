import ArrowBack from "@/components/ArrowBack/ArrowBack";
import Footer from "@/components/Footer/Footer";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import Spinner from "@/components/Spinner";
import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { ScienceFair } from "@/lib/models/scienceFair";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ChooseFair() {
  const [heigth, setHeigth] = useState<number | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [availableFairs, setAvailableFairs] = useState<ScienceFair[]>([]);

  const { push } = useRouter();

  useEffect(() => {
    let mounted = true;
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();

    const evaluatorCode = localStorage.getItem("evaluatorCode");
    if (!evaluatorCode) {
      push("/avaliador");
    }

    const fairs: ScienceFair[] = JSON.parse(localStorage.getItem("evailableFairs") ?? "[]");

    let needToReload = true;
    if (fairs.length > 0) {
      setAvailableFairs(fairs);

      const lastUpdatedTime = localStorage.getItem("evailableFairsLastUpdated");
      if (lastUpdatedTime) {
        const futureDate = new Date(Number.parseInt(lastUpdatedTime)).setMinutes(new Date().getMinutes() + 10);

        if (futureDate < Date.now()) {
          needToReload = true;
        } else {
          setLoading(false);
        }
      }
    }

    if (needToReload) {
      (async () => {
        await fetch("/api/evaluator/fairs")
          .then((res) => {
            if (res.status === 429) {
              throw new Error("Nós evitamos muitas requisições seguidas. Espere um pouco e tente novamente.");
            }
            return res.json();
          })
          .then((data: AvaliaApiResponse) => {
            if (mounted) {
              if (data.status === "success") {
                setAvailableFairs(data.data as ScienceFair[]);
                localStorage.setItem("evailableFairs", JSON.stringify(data.data));
                localStorage.setItem("evailableFairsLastUpdated", Date.now().toString());
              } else {
                toast.error("Não foi possível obter a lista de feiras. Tente recarregar a página.");
              }
              setLoading(false);
            }
          })
          .catch((error) => {
            setLoading(false);
            toast.error(error.message);
          });
      })();
    }

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      mounted = false;
    };
  }, [push]);

  const handleWindowResize = () => {
    const componentHeight = document.getElementById("fairsAvailableArea")?.clientHeight;
    setHeigth(componentHeight ?? 400);
  };

  const filteredFairs = availableFairs.filter(
    (item) =>
      item.fairName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fairSchool.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectFair = (fairId: string): void => {
    const evaluatorCode = localStorage.getItem("evaluatorCode");
    push(`/avaliador/?code=${evaluatorCode?.toUpperCase()}-${fairId}`);
  };

  return (
    <main className="z-10 flex flex-col items-center relative px-6 pt-20 pb-10 sm:pb-10 md:pb-14 lg:pb-20">
      <Head>
        <title>Login do Avaliador | Avalia</title>
      </Head>
      <HeaderTitle />
      <div
        id="fairsAvailableArea"
        className="bg-white shadow-md rounded-lg px-4 pt-12 pb-6 mb-12 max-w-lg w-full text-center"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-10">Para qual feira é seu convite?</h2>
        <div className="px-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Procurar na lista..."
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
          <div className="my-4">
            <hr />
          </div>
          {heigth && (
            <div
              className="overflow-auto mb-10"
              style={{
                maxHeight: heigth * 1.4,
                maskImage: "linear-gradient(to bottom, black calc(100% - 32px), transparent 100%)",
              }}
            >
              {loading ? (
                <div className="w-full text-center flex items-center justify-center h-16">
                  <Spinner />
                </div>
              ) : availableFairs.length === 0 ? (
                <NoFairsFound />
              ) : (
                <FairsList fairs={filteredFairs} selectFair={selectFair} />
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ArrowBack route="/avaliador" />
    </main>
  );
}

function NoFairsFound() {
  return (
    <div className="text-center text-sm text-gray-500">
      Nenhuma feira encontrada.
      <br />
      <p className="mt-4">Parece que ainda não tem ninguém usando o Avalia :/</p>
    </div>
  );
}

function FairsList({ fairs, selectFair }: { fairs: ScienceFair[]; selectFair: (fairId: string) => void }) {
  return (
    <div className="flex flex-col justify-center items-center px-3 mb-20">
      {fairs.map((fair) => (
        <FairListItem fair={fair} key={fair.fairId} selectFair={selectFair} />
      ))}
    </div>
  );
}

function FairListItem({ fair, selectFair }: { fair: ScienceFair; selectFair: (fairId: string) => void }) {
  return (
    <div
      onClick={() => selectFair(fair.fairId)}
      className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer rounded-lg w-full justify-between mb-2 group"
    >
      <div className="flex flex-col items-start justify-center">
        <h3 className="text-normal text-gray-700">{fair.fairName}</h3>
        <p className="text-xs text-gray-500 font-light">{fair.fairSchool}</p>
      </div>
      <span className="ml-2 transform group-hover:translate-x-2 transition-transform">&rarr;</span>
    </div>
  );
}
