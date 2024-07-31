import AdminMenu from "@/components/AdminMenu/AdminMenu";
import { auth } from "@/lib/firebase/config";
import type { Category } from "@/lib/models/category";
import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fairInfo = localStorage.getItem("fairInfo");
        if (fairInfo) {
          (async () => {
            await fetch("/api/admin/ranking")
              .then((res) => res.json())
              .then((data) => {
                if (mounted) {
                  setRanking(data);
                  setLoading(false);
                }
              });
          })();
        } else {
          router.push("/admin/setup");
        }
      } else {
        router.push("/admin/login");
      }
    });

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <main className="z-10 flex flex-col relative px-10 py-10 h-screen">
      <Head>
        <title>Administração | Avalia</title>
      </Head>
      <Toaster />
      {!loading && (
        <div className="flex w-full gap-x-8 h-screen">
          <AdminMenu path={router.pathname} pushRoute={router.push} />
          <div className="bg-white shadow-md rounded-lg px-6 py-10 w-full" id="rankingAvailableArea">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Classificação dos projetos</h2>
            {ranking.length > 0 ? <RankingContent ranking={ranking} /> : <NoContent />}
          </div>
        </div>
      )}
    </main>
  );
}

function RankingContent({ ranking }: Readonly<{ ranking: Category[] }>) {
  const [heigth, setHeigth] = useState<number | undefined>();

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

  return (
    <div>
      {heigth && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto px-3 pb-20"
          style={{
            maxHeight: heigth * 0.8,
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
                <p className="font-semibold mb-6">{rank.title}</p>
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
                        <p className="text-xs text-gray-500">({project.score} pontos)</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NoContent() {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-20">
      <Image src="/images/empty.svg" alt="Sem dados atualmente" width={647.63626 / 2} height={632.17383 / 2} />
      <p className="text-gray-500 text-center font-light">
        Para ver as informações aqui, configure as diferentes categorias
        <br />
        de projetos na aba &quot;Configurações&quot;.
      </p>
    </div>
  );
}
