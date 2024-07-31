import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { FairUser } from "@/lib/models/user";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DialogComponent from "../Dialog/Dialog";
import Spinner from "../Spinner";
import ConfigItem from "./ConfigItem";

export default function UsersConfiguration() {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  return (
    <>
      <ConfigItem text="Gerenciar usuários administrativos" onClick={() => setDialogIsOpen(true)} />
      <DialogComponent open={dialogIsOpen} setOpen={setDialogIsOpen} title="Lista de usuários" buttonText="Fechar">
        <div className="flex">
          <input
            type="text"
            className="w-3/4 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
            placeholder="Email do novo usuário..."
          />
          <button
            type="button"
            className="w-1/4 p-2 bg-blue-500 text-white transition-all rounded-r-lg hover:bg-blue-600"
          >
            Convidar
          </button>
        </div>
        <UsersList />
      </DialogComponent>
    </>
  );
}

function UsersList() {
  const [users, setUsers] = useState<FairUser[] | undefined>();

  useEffect(() => {
    let mounted = true;

    const fairId = localStorage.getItem("fairId");
    const userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "{}");

    (async () => {
      // TODO: implement on server-side the validation:
      // A user can only retrieve users that are from the same Science Fair of himself
      fetch(`/api/auth/users?fairId=${fairId}&user=${userInfo.email}`)
        .then((res) => res.json())
        .then((data: AvaliaApiResponse) => {
          if (mounted) {
            if (data.status === "success") {
              setUsers(data.data as FairUser[]);
            } else {
              toast.error(data.message ?? "Não foi possível recuperar os usuários administradores da feira.");
            }
          }
        });
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col w-100 space-y-2 mt-6">
      {users ? (
        <>
          {users && users.length > 0 ? (
            users.map((u) => <UserListItem key={u.email} user={u} />)
          ) : (
            <p className="flex items-center justify-center font-light text-xs pt-4">Nenhum usuário encontrado.</p>
          )}
          {users && users.length > 0 ? (
            <p className="flex items-center justify-center font-light text-xs pt-4">
              Mostrando todos os {users.length} usuários (você não será listado)
            </p>
          ) : (
            <p className="flex items-center justify-center font-light text-xs">
              Nenhum usuário adicionado (você não será listado)
            </p>
          )}
        </>
      ) : (
        <div className="w-full text-center flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <p className="flex items-center justify-center font-light text-xs">
        Convide apenas os usuários realmente necessários.
      </p>
    </div>
  );
}

function UserListItem({
  user,
}: Readonly<{
  user: FairUser;
}>) {
  const copyInviteLink = () => {
    // TODO: it's actually copying the email, which doesn't make sense, it's only symbolic. Change to copy an invite link.
    navigator.clipboard.writeText(user.email);
    toast.success("Link de convite copiado!");
  };

  return (
    <div className="border rounded-md border-gray-200 py-2 px-3 flex items-center justify-between">
      <p className="flex flex-col">
        <span className="text-gray-700">{user.email}</span>
        {!user.inviteAccepted && (
          <span className="py-1 px-2 mt-1 rounded-md text-xs font-light text-yellow-800 ring-1 ring-inset ring-yellow-600/20 bg-yellow-50">
            Convite pendente
          </span>
        )}
      </p>
      <div className="flex space-x-2">
        {!user.inviteAccepted && (
          <button
            type="button"
            className="border border-gray-200 text-gray-600 rounded-md px-2 py-1 bg-gray-100 hover:bg-gray-200 hover:border-gray-300 transition-all"
            onClick={() => copyInviteLink()}
          >
            Link de Convite
          </button>
        )}
        <button
          type="button"
          className="border border-red-500 text-white rounded-md px-2 py-1 bg-red-400 hover:bg-red-500 hover:border-red-600 transition-all"
        >
          Remover
        </button>
      </div>
    </div>
  );
}
