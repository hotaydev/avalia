import { useRouter } from "next/router";
import wipeLocalStorage from "@/lib/services/wipeLocalStorage";

export default function EvaluatorLogoutComponent() {
  const { push } = useRouter();

  const handleLogout = () => {
    wipeLocalStorage();
    push("/");
  };

  return (
    <div className="static md:fixed md:top-2 md:right-6">
      <span
        className="px-6 rounded-full cursor-pointer font-light text-sm hover:underline transition-all text-gray-600"
        onClick={handleLogout}
      >
        <span className="hidden md:block pr-5">Sair da sua conta</span>
        <span className="block md:hidden">Sair</span>
      </span>
    </div>
  );
}
