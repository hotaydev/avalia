import { useRouter } from "next/router";

export default function LogoutComponent() {
  const { push } = useRouter();

  const handleLogout = () => {
    // TODO: handle logout
    localStorage.removeItem("evaluatorCode");
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
