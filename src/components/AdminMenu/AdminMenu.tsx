import type { Url } from "next/dist/shared/lib/router/router";
import Image from "next/image";
import Link from "next/link";
import { IoPower } from "react-icons/io5";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import AvaliaAuthentication from "@/lib/services/auth";

export default function AdminMenu({
  path,
  pushRoute,
}: Readonly<{
  path: string;
  pushRoute: (a: Url) => Promise<boolean>;
}>) {
  return (
    <div className="bg-white flex flex-col justify-between shadow-md rounded-lg px-4 pt-8 pb-4 max-w-xs w-full">
      <div>
        <HeaderTitle mb="10" />
        <div className="px-8 mb-8">
          <hr />
        </div>
        <div className="space-y-4">
          <MenuItem name="Classificação" selected={path === "/admin"} pushRoute={pushRoute} route="/admin" />
          <MenuItem
            name="Avaliadores"
            selected={path === "/admin/evaluators"}
            pushRoute={pushRoute}
            route="/admin/evaluators"
          />
          <MenuItem
            name="Projetos"
            selected={path === "/admin/projects"}
            pushRoute={pushRoute}
            route="/admin/projects"
          />
          <MenuItem
            name="Configurações"
            selected={path === "/admin/settings"}
            pushRoute={pushRoute}
            route="/admin/settings"
          />
          <div className="px-8 mb-8">
            <hr />
          </div>
          <div
            className="border-2 border-gray-100 hover:border-gray-200 text-gray-800 rounded-lg px-6 py-3 flex items-center justify-between transition-all cursor-pointer group"
            onClick={() => {
              new AvaliaAuthentication().logout();
              pushRoute("/");
            }}
          >
            Sair da sua conta{" "}
            <span className="ml-2">
              <IoPower className="group-hover:text-red-600 transition-all" />
            </span>
          </div>
        </div>
      </div>
      <div className="z-10 text-gray-500 text-center flex flex-col items-center justify-center py-4 w-full font-light relative">
        Desenvolvido gratuitamente pela
        <Link href="https://www.hotay.dev" target="_blank" rel="noopener noreferrer" className="mt-2">
          <Image src="/images/hotay.svg" alt="Logo da Hotay" width={70} height={23} />
        </Link>
      </div>
    </div>
  );
}

function MenuItem({
  name,
  selected = false,
  pushRoute,
  route,
}: Readonly<{
  name: string;
  selected?: boolean;
  pushRoute: (a: Url) => Promise<boolean>;
  route: string;
}>) {
  const extraClass = selected
    ? "border-l-blue-500 border-l-4 bg-blue-100 hover:bg-blue-200"
    : "bg-gray-100 hover:bg-gray-200";

  return (
    <div
      className={`${extraClass} text-gray-800 rounded-lg px-6 py-3 flex items-center justify-between transition-all cursor-pointer`}
      onClick={() => pushRoute(route)}
    >
      {name}
    </div>
  );
}
