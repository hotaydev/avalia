import AdminMenu from "@/components/AdminMenu/AdminMenu";
import DialogComponent from "@/components/Dialog/Dialog";
import Spinner from "@/components/Spinner";
import { auth } from "@/lib/firebase/config";
import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { Category } from "@/lib/models/category";
import type { ScienceFair } from "@/lib/models/scienceFair";
import { getLastTime } from "@/lib/utils/lastUpdateTime";
import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import Image from "next/image";
import { type NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoReload } from "react-icons/io5";
import { SlMagnifier } from "react-icons/sl";
import { Tooltip } from "react-tooltip";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("userInfo", JSON.stringify(user));
        const fairInfo = localStorage.getItem("fairInfo");

        if (!fairInfo) {
          router.push("/admin/setup");
          return;
        }

        const rankingInfo = localStorage.getItem("ranking");

        if (rankingInfo && JSON.parse(rankingInfo).length > 0) {
          setRanking(JSON.parse(rankingInfo));
          setLoading(false);
        } else {
          const fairInfoParsed: ScienceFair = JSON.parse(fairInfo);
          (async () => {
            await fetch(`/api/admin/ranking/?sheetId=${fairInfoParsed.spreadsheetId}`)
              .then((res) => res.json())
              .then((data: AvaliaApiResponse) => {
                if (mounted) {
                  handleRankingApiResponse(data);
                }
              });
          })();
        }
      } else {
        router.push("/admin/login");
      }
    });

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleRankingApiResponse = (data: AvaliaApiResponse) => {
    if (data.status === "success") {
      setRanking(data.data as Category[]);
      localStorage.setItem("ranking", JSON.stringify(data.data));
      localStorage.setItem("rankingLastUpdated", Date.now().toString());
    } else {
      toast.error(
        data.message ??
          "Não foi possível obter as colocações. Tente novamente mais tarde ou veja diretamente na planilha.",
      );
    }
    setLoading(false);
  };

  return (
    <main className="z-10 flex flex-col relative px-10 py-10 h-screen">
      <Head>
        <title>Administração | Avalia</title>
      </Head>
      <Toaster />
      <div className="flex w-full gap-x-8 h-screen">
        <AdminMenu path={router.pathname} pushRoute={router.push} />
        <div className="bg-white shadow-md rounded-lg px-6 py-10 w-full" id="rankingAvailableArea">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Classificação dos projetos</h2>
          {loading ? (
            <div className="w-full flex h-full pb-20 justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <>
              {ranking.length > 0 ? (
                <RankingContent ranking={ranking} router={router} />
              ) : (
                <NoContent router={router} />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function RankingContent({ ranking, router }: Readonly<{ ranking: Category[]; router: NextRouter }>) {
  const [heigth, setHeigth] = useState<number | undefined>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleWindowResize = () => {
    const componentHeight = document.getElementById("rankingAvailableArea")?.clientHeight;
    setHeigth(componentHeight ?? 300);
  };

  const reloadRankingList = () => {
    localStorage.removeItem("ranking");
    localStorage.removeItem("rankingLastUpdated");
    router.reload();
  };

  return (
    <div>
      <div className="flex items-center justify-center mb-6">
        <p className="text-gray-500 font-light text-sm">Última atualização há {getLastTime("rankingLastUpdated")}</p>
        <div
          className="ml-1 p-2 bg-white hover:bg-gray-100 transition-all cursor-pointer rounded-md"
          onClick={reloadRankingList}
        >
          <IoReload size={18} />
        </div>
      </div>
      {heigth && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto px-3 pb-20"
          style={{
            maxHeight: heigth * 0.7,
            maskImage: "linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)",
          }}
        >
          {ranking.map((rank) => {
            const sortedRanking = rank.projects
              .toSorted((a, b) => ((a.score ?? 0) > (b.score ?? 0) ? -1 : 1))
              .slice(0, 5);
            let rankingModifier = 1;
            return (
              <div key={rank.title} className="bg-gray-50 rounded-md px-4 text-center pt-4 pb-6">
                <div className="flex justify-between items-center">
                  <span> </span>
                  <p className="font-semibold pl-6">{rank.title}</p>
                  <span
                    className="p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all rounded-md"
                    data-tooltip-id="see-all-projects-ranking"
                    data-tooltip-content="Ver classificação de todos os projetos"
                    data-tooltip-place="left"
                    onClick={() => {
                      setSelectedCategory(rank);
                      setDialogOpen(true);
                    }}
                  >
                    <SlMagnifier size={12} />
                  </span>
                  <Tooltip id="see-all-projects-ranking" />
                </div>
                <p className="mb-6 font-light text-sm text-gray-500">
                  Mostrando os {sortedRanking.length} (max. 5) melhores
                </p>
                <div className="flex flex-col space-y-2 px-4">
                  {sortedRanking.map((project, index) => {
                    let medal = "";

                    switch (index) {
                      case 0:
                        medal = "border-blue-700 border-2";
                        break;
                      case 1:
                        medal = "border-blue-600 border-2";
                        break;
                      case 2:
                        medal = "border-blue-500 border-2";
                        break;
                      case 3:
                        medal = "border-blue-400 border-2";
                        break;
                      case 4:
                        medal = "border-blue-300 border-2";
                        break;
                      default:
                        medal = "border-gray-200 border";
                        break;
                    }

                    if (index !== 0 && sortedRanking[index].score === sortedRanking[index - 1].score) {
                      rankingModifier--;
                    }

                    return (
                      <div
                        key={project.id}
                        className={`flex justify-between gap-2 bg-white items-center px-4 py-2 rounded-md ${medal}`}
                      >
                        <div className="flex justify-start items-center gap-4">
                          {index === 0 && <p className="font-semibold">1º</p>}
                          {index !== 0 && (
                            <p className="font-semibold">
                              {sortedRanking[index].score === sortedRanking[index - 1].score
                                ? index
                                : index + rankingModifier}
                              º
                            </p>
                          )}
                          <p className="text-gray-700 text-sm" title={project.title}>
                            {project.title.substring(0, 35)}
                            {project.title.length > 35 ? "..." : ""}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">Nota {project.score}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <DialogComponent
        open={dialogOpen}
        setOpen={setDialogOpen}
        title={`Todos os projetos da categoria ${selectedCategory?.title}`}
        buttonText="Fechar"
      >
        {selectedCategory && (
          <div className="flex flex-col space-y-2 px-4 overflow-auto" style={{ height: "calc(100vh * 0.6)" }}>
            {selectedCategory.projects
              .toSorted((a, b) => ((a.score ?? 0) > (b.score ?? 0) ? -1 : 1))
              .map((project, index) => {
                let medal = "";

                switch (index) {
                  case 0:
                    medal = "border-blue-700 border-2";
                    break;
                  case 1:
                    medal = "border-blue-600 border-2";
                    break;
                  case 2:
                    medal = "border-blue-500 border-2";
                    break;
                  case 3:
                    medal = "border-blue-400 border-2";
                    break;
                  case 4:
                    medal = "border-blue-300 border-2";
                    break;
                  default:
                    medal = "border-gray-200 border";
                    break;
                }

                return (
                  <div
                    key={project.id}
                    className={`flex justify-between gap-2 bg-white items-center px-4 py-2 rounded-md ${medal}`}
                  >
                    <div className="flex justify-start items-center gap-4">
                      {index === 0 && <p className="font-semibold">1º</p>}
                      {index !== 0 && <p className="font-semibold">{index}º</p>}
                      <p className="text-gray-700 text-sm" title={project.title}>
                        {project.title.substring(0, 35)}
                        {project.title.length > 35 ? "..." : ""}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">Nota {project.score}</p>
                  </div>
                );
              })}
          </div>
        )}
      </DialogComponent>
    </div>
  );
}

function NoContent({ router }: { router: NextRouter }) {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-20">
      <Image src="/images/empty.svg" alt="Sem dados atualmente" width={647.63626 / 2} height={632.17383 / 2} />
      <p className="text-gray-500 text-center font-light">
        Para ver as informações aqui, configure as diferentes categorias
        <br />
        de projetos na aba &quot;Configurações&quot;.
      </p>
      <div className="w-full flex flex-col items-center justify-center">
        <button
          type="button"
          className="w-1/4 p-2 mb-2 bg-blue-500 text-white transition-all rounded-lg hover:bg-blue-600"
          onClick={() => router.reload()}
        >
          Atualizar
        </button>
        <p className="text-gray-500 font-light text-sm">Última atualização há {getLastTime("rankingLastUpdated")}</p>
      </div>
    </div>
  );
}
