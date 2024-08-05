import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { ScienceFair } from "@/lib/models/scienceFair";
import type { FairUser } from "@/lib/models/user";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DialogComponent from "../Dialog/Dialog";
import Spinner from "../Spinner";
import ConfigItem from "./ConfigItem";

const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export default function UsersConfiguration() {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [fairInfo, setFairInfo] = useState<ScienceFair | undefined>();

  useEffect(() => {
    const _fairInfo = JSON.parse(localStorage.getItem("fairInfo") ?? "{}");
    setFairInfo(_fairInfo);
  }, []);

  const addNewUser = async (): Promise<void> => {
    if (!newUserEmail) {
      toast.error("Preencha o email do convite.");
      return;
    }

    if (!newUserEmail.match(isValidEmail)) {
      toast.error("Email inválido, por favor confira o email digitado.");
      return;
    }

    const toastId = toast.loading("Criando usuário...");
    await fetch(`/api/admin/fairs/add-user/?user=${newUserEmail}&fairId=${fairInfo?.fairId}`)
      .then((res) => res.json())
      .then((data: AvaliaApiResponse) => {
        toast.dismiss(toastId);
        if (data.status === "success") {
          setDialogIsOpen(false);
          toast.success("Usuário adicionado com sucesso!");
          toast.success(
            "Lembre de enviar o link de convite ao usuário, ou pedir para ele se cadastrar usando o email convidado.",
          );
        } else {
          toast.error(data.message ?? "Não foi possível criar o usuário. Tente novamente mais tarde.");
        }
      });
  };

  return (
    <>
      <ConfigItem text="Gerenciar usuários administrativos" onClick={() => setDialogIsOpen(true)} />
      <DialogComponent open={dialogIsOpen} setOpen={setDialogIsOpen} title="Lista de usuários" buttonText="Fechar">
        <div className="flex">
          <input
            type="text"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value.toLowerCase())}
            className="w-3/4 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
            placeholder="Email do novo usuário..."
          />
          <button
            type="button"
            onClick={addNewUser}
            className="w-1/4 p-2 bg-blue-500 text-white transition-all rounded-r-lg hover:bg-blue-600"
          >
            Convidar
          </button>
        </div>
        <UsersList fairInfo={fairInfo} />
      </DialogComponent>
    </>
  );
}

function UsersList({ fairInfo }: { fairInfo: ScienceFair | undefined }) {
  const [users, setUsers] = useState<FairUser[] | undefined>();

  useEffect(() => {
    let mounted = true;

    if (fairInfo?.fairId) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "{}");

      (async () => {
        await fetch(`/api/auth/users/?fairId=${fairInfo?.fairId}&user=${userInfo.email}`)
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
    }

    return () => {
      mounted = false;
    };
  }, [fairInfo]);

  const deleteUser = async (user: FairUser): Promise<void> => {
    const toastId = toast.loading("Removendo usuário...");
    await fetch(`/api/admin/fairs/remove-user/?fairId=${fairInfo?.fairId}&user=${user.email}`)
      .then((res) => res.json())
      .then((data: AvaliaApiResponse) => {
        toast.dismiss(toastId);
        if (data.status === "success") {
          toast.success("Usuário removido com sucesso");
          const newUsers = users?.filter((u) => u.email !== user.email);
          setUsers(newUsers);
        } else {
          toast.success(data.message ?? "Não foi possível remover o usuário. Tente novamente mais tarde.");
        }
      });
  };

  return (
    <div className="flex flex-col w-100 space-y-2 mt-6">
      {users ? (
        <>
          {users && users.length > 0 ? (
            users.map((u) => <UserListItem key={u.email} user={u} fair={fairInfo} deleteUser={deleteUser} />)
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
  fair,
  deleteUser,
}: Readonly<{
  user: FairUser;
  fair?: ScienceFair;
  deleteUser: (user: FairUser) => Promise<void>;
}>) {
  const copyInviteLink = () => {
    const link = `${process.env.NEXT_PUBLIC_APPLICATION_DOMAIN}/admin/login/invite?fair=${fair?.fairName}&email=${user.email}`;
    navigator.clipboard.writeText(link);
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
        {user.email === fair?.adminEmail ? (
          <span className="py-1 px-2 bg-blue-100 rounded-md">Administrador</span>
        ) : (
          <button
            type="button"
            onClick={async () => await deleteUser(user)}
            className="border border-red-500 text-white rounded-md px-2 py-1 bg-red-400 hover:bg-red-500 hover:border-red-600 transition-all"
          >
            Remover
          </button>
        )}
      </div>
    </div>
  );
}
