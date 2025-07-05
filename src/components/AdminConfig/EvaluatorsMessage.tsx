import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DEFAULT_EVALUATOR_INVITE_MESSAGE, PLACEHOLDER_TAGS } from "@/lib/constants/messages";
import DialogComponent from "../Dialog/Dialog";
import ConfigItem from "./ConfigItem";

export default function EditEvaluatorsMessage({ needToOpenDialog }: { needToOpenDialog?: boolean }) {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedMessage = localStorage.getItem("evaluatorsMessage");
    if (savedMessage) {
      setMessage(savedMessage);
    } else {
      setMessage(DEFAULT_EVALUATOR_INVITE_MESSAGE);
    }
  }, [dialogIsOpen]);

  useEffect(() => {
    if (needToOpenDialog) {
      setDialogIsOpen(true);
    }
  }, [needToOpenDialog]);

  const saveMessage = () => {
    if (!message) return;
    localStorage.setItem("evaluatorsMessage", message);
    toast.success("Mensagem editada com sucesso!");
  };

  const insertPlaceholder = (placeholder: string) => {
    setMessage((prev) => {
      const newMessage = prev + placeholder;
      return newMessage;
    });
  };

  return (
    <>
      <ConfigItem text="Mensagem para os Avaliadores" onClick={() => setDialogIsOpen(true)} />
      <DialogComponent
        open={dialogIsOpen}
        setOpen={setDialogIsOpen}
        title="Configurar mensagem para os Avaliadores"
        buttonText="Salvar alterações"
        onClick={saveMessage}
      >
        <div className="flex flex-col pr-6 mb-2 w-full mt-4">
          <p className="text-sm text-gray-600 mb-3">
            Esta é a mensagem que será enviada aos avaliadores através da página da lista de avaliadores. As alterações
            são salvas apenas localmente (somente no seu navegador).
          </p>

          <p className="text-sm text-gray-600 mb-2">
            Utilize os botões abaixo para inserir "variáveis" na mensagem. Esses valores serão substituídos pelos dados
            reais antes do envio da mensagem.
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {Object.values(PLACEHOLDER_TAGS).map((placeholder) => (
              <PlaceholderButton
                key={placeholder.id}
                placeholder={placeholder.text}
                onClick={() => insertPlaceholder(placeholder.id)}
              />
            ))}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={DEFAULT_EVALUATOR_INVITE_MESSAGE}
            className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MessageStatus message={message} />
        </div>
      </DialogComponent>
    </>
  );
}

const PlaceholderButton = ({ placeholder, onClick }: { placeholder: string; onClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 cursor-pointer"
    >
      {placeholder}
    </button>
  );
};

const MessageStatus = ({ message }: { message: string }) => {
  const isDefaultMessage = message === DEFAULT_EVALUATOR_INVITE_MESSAGE;

  return (
    <div className="w-full flex justify-end mt-2">
      <span
        className={`text-xs px-2 py-1 rounded-full ${isDefaultMessage ? "bg-gray-200 text-gray-700" : "bg-blue-100 text-blue-800"}`}
      >
        {isDefaultMessage ? "Mensagem Padrão" : "Mensagem Personalizada"}
      </span>
    </div>
  );
};
