import { EVALUATOR_INVITE_MESSAGE } from "@/lib/constants/messages";
import type { AvaliaApiResponse } from "@/lib/models/apiResponse";
import type { Evaluator } from "@/lib/models/evaluator";
import type { ProjectForAdmin } from "@/lib/models/project";
import type { ScienceFair } from "@/lib/models/scienceFair";
import { type ChangeEvent, type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import toast from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { IoMdLink } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import AddEvaluatorToProject from "../AddEvaluatorToProject/AddEvaluatorToProject";
import AddProjectToEvaluator from "../AddProjectToEvaluator/AddProjectToEvaluator";

interface SortConfig {
  key: string;
  direction: "ascending" | "descending";
}

interface SortConfigForProjects extends SortConfig {
  key: keyof ProjectForAdmin;
}

interface SortConfigForEvaluators extends SortConfig {
  key: keyof Evaluator;
}

const evaluatorsTableColumns: {
  key: keyof Evaluator | "__send__";
  title: string;
}[] = [
  { key: "id", title: "ID" },
  { key: "name", title: "Nome" },
  { key: "field", title: "Área de Atuação" },
  { key: "projects", title: "Projetos" },
  { key: "__send__", title: "Contato" },
];

const projectsTableColumns: {
  key: keyof ProjectForAdmin;
  title: string;
}[] = [
  { key: "id", title: "ID" },
  { key: "title", title: "Título" },
  { key: "category", title: "Categoria" },
  { key: "field", title: "Área" },
  { key: "evaluators", title: "Avaliadores" },
];

export default function SortableTable({
  table,
  extraComponent,
  setPreviousData,
}: Readonly<{
  table: "evaluators" | "projects";
  extraComponent?: JSX.Element;
  // biome-ignore lint/suspicious/noExplicitAny: The type is ProjectForAdmin[] | Evaluator[], but cannot be explicity set due to object type errors below
  setPreviousData?: Dispatch<SetStateAction<any[]>>;
}>) {
  const [heigth, setHeigth] = useState<number | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleWindowResize = () => {
    const componentHeight = document.getElementById("tableAvailableArea")?.clientHeight;
    setHeigth(componentHeight ?? 300);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getArrow = (key: string, sortConfig: SortConfig): string => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return " "; // Non-breaking space
  };

  return (
    <div className="pl-4 py-4 pr-1">
      <div className="w-full flex justify-between items-center">
        <input
          type="text"
          placeholder="Pesquisar..."
          value={searchTerm}
          onChange={handleSearch}
          className="mb-4 p-2 border border-gray-300 rounded-lg"
        />
        {extraComponent}
      </div>
      {heigth &&
        (table === "evaluators" ? (
          <EvaluatorsTable heigth={heigth} searchTerm={searchTerm} getArrow={getArrow} />
        ) : (
          <ProjectsTable
            setPreviousData={setPreviousData}
            heigth={heigth}
            searchTerm={searchTerm}
            getArrow={getArrow}
          />
        ))}
    </div>
  );
}

function EvaluatorsTable({
  heigth,
  searchTerm,
  getArrow,
}: Readonly<{ heigth: number; searchTerm: string; getArrow: (key: string, sortConfig: SortConfig) => string }>) {
  const [sortConfig, setSortConfig] = useState<SortConfigForEvaluators>({
    key: "id",
    direction: "ascending",
  });
  const [evaluatorList, setEvaluatorList] = useState<Evaluator[]>([]);

  useEffect(() => {
    let isMounted = true;

    const localEvaluatorList = localStorage.getItem("evaluatorsList");

    if (localEvaluatorList) {
      setEvaluatorList(JSON.parse(localEvaluatorList));
    } else {
      (async () => {
        const toastId = toast.loading(
          "Buscando avaliadores... Após isso a lista será assíncrona, use o botão a baixo para recarregar.",
        );
        const fairInfo = JSON.parse(localStorage.getItem("fairInfo") ?? "{}");
        if (fairInfo.spreadsheetId) {
          await fetch(`/api/admin/evaluators/?sheetId=${fairInfo?.spreadsheetId}`)
            .then((res) => res.json())
            .then((data: AvaliaApiResponse) => {
              toast.dismiss(toastId);
              if (isMounted) {
                if (data.status === "success") {
                  setEvaluatorList(data.data as Evaluator[]);
                  localStorage.setItem("evaluatorsList", JSON.stringify(data.data));
                  localStorage.setItem("evaluatorsListLastUpdated", Date.now().toString());
                } else {
                  toast.error(
                    data.message ?? "Não foi possível atualizar a lista de avaliadores. Tente novamente mais tarde.",
                  );
                }
              }
            });
        }
      })();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedData: Evaluator[] = useMemo(() => {
    const sortableItems = [...evaluatorList];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        return compareValues(aValue, bValue, sortConfig.direction);
      });
    }
    return sortableItems;
  }, [evaluatorList, sortConfig]);

  const filteredData = sortedData.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.field?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const requestSort = (key: string): void => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction } as SortConfigForEvaluators);
  };

  return (
    <TableContent
      requestSort={requestSort}
      filteredData={filteredData}
      heigth={heigth}
      getArrow={getArrow}
      sortConfig={sortConfig}
      columns={evaluatorsTableColumns}
    />
  );
}

function ProjectsTable({
  heigth,
  searchTerm,
  getArrow,
  setPreviousData,
}: Readonly<{
  heigth: number;
  searchTerm: string;
  getArrow: (key: string, sortConfig: SortConfig) => string;
  // biome-ignore lint/suspicious/noExplicitAny: The type is ProjectForAdmin[] | Evaluator[], but cannot be explicity set due to object type errors below
  setPreviousData?: Dispatch<SetStateAction<any[]>>;
}>) {
  const [sortConfig, setSortConfig] = useState<SortConfigForProjects>({
    key: "id",
    direction: "ascending",
  });
  const [projectList, setProjectList] = useState<ProjectForAdmin[]>([]);

  useEffect(() => {
    let isMounted = true;

    const localProjectList = localStorage.getItem("projectsList");

    if (localProjectList) {
      setProjectList(JSON.parse(localProjectList));
      if (setPreviousData) {
        setPreviousData(JSON.parse(localProjectList));
      }
    } else {
      (async () => {
        const toastId = toast.loading(
          "Buscando projetos... Após isso a lista será assíncrona, use o botão a baixo para recarregar.",
        );
        const fairInfo = JSON.parse(localStorage.getItem("fairInfo") ?? "{}");
        if (fairInfo.spreadsheetId) {
          await fetch(`/api/admin/projects/?sheetId=${fairInfo?.spreadsheetId}`)
            .then((res) => res.json())
            .then((data: AvaliaApiResponse) => {
              toast.dismiss(toastId);
              if (isMounted) {
                if (data.status === "success") {
                  setProjectsListLocally(data.data as ProjectForAdmin[]);
                } else {
                  toast.error(
                    data.message ?? "Não foi possível atualizar a lista de avaliadores. Tente novamente mais tarde.",
                  );
                }
              }
            });
        }
      })();
    }

    return () => {
      isMounted = false;
    };
  }, [setPreviousData]);

  const setProjectsListLocally = (data: ProjectForAdmin[]): void => {
    setProjectList(data);
    if (setPreviousData) {
      setPreviousData(data);
    }
    localStorage.setItem("projectsList", JSON.stringify(data));
    localStorage.setItem("projectsListLastUpdated", Date.now().toString());
  };

  const sortedData: ProjectForAdmin[] = useMemo(() => {
    const sortableItems = [...projectList];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        return compareValues(aValue, bValue, sortConfig.direction);
      });
    }
    return sortableItems;
  }, [projectList, sortConfig]);

  const filteredData = sortedData.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.field?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction } as SortConfigForProjects);
  };

  return (
    <TableContent
      requestSort={requestSort}
      filteredData={filteredData}
      heigth={heigth}
      getArrow={getArrow}
      sortConfig={sortConfig}
      columns={projectsTableColumns}
    />
  );
}

function TableContent({
  filteredData,
  heigth,
  columns,
  getArrow,
  sortConfig,
  requestSort,
}: Readonly<{
  // biome-ignore lint/suspicious/noExplicitAny: The type is ProjectForAdmin[] | Evaluator[], but cannot be explicity set due to object type errors below
  filteredData: any[];
  heigth: number;
  columns: { key: string; title: string }[];
  getArrow: (key: string, sortConfig: SortConfig) => string;
  sortConfig: SortConfig | SortConfigForEvaluators | SortConfigForProjects;
  requestSort: (key: string) => void;
}>) {
  const fairInfo = JSON.parse(localStorage.getItem("fairInfo") ?? "{}");

  const classesIfIsFirstElement = (index: number): string | null => {
    return index === 0 ? "pl-4 pr-2 rounded-tl-lg rounded-bl-lg" : null;
  };

  const classesIfIsLastElement = (index: number): string | null => {
    return index === columns.length - 1 ? "pr-4 pl-2 rounded-tr-lg rounded-br-lg" : null;
  };

  const idUppercaseOrValue = (columnKey: string, itemVal: string | number) => {
    return columnKey === "id" ? clickToCopyIdSection(itemVal.toString().toUpperCase()) : itemVal;
  };

  const clickToCopyIdSection = (id: string) => {
    return (
      <div
        className="cursor-default w-min"
        data-tooltip-id="click-to-copy-the-id"
        data-tooltip-content="Clique para copiar"
        data-tooltip-place="right"
        onClick={() => {
          navigator.clipboard.writeText(id);
          toast.success("Copiado!");
        }}
      >
        {id}
      </div>
    );
  };

  const blankItemIfNoValue = (columnKey: string) => {
    return columnKey === "__send__" ? "" : "---";
  };

  return (
    <div
      className="overflow-auto rounded-lg pr-3"
      style={{
        maxHeight: heigth * 0.7,
        maskImage: "linear-gradient(to bottom, black calc(100% - 32px), transparent 100%)",
      }}
    >
      <Tooltip id="click-to-copy-the-id" />
      <table className="table-auto min-w-full pb-6 border-separate border-spacing-y-2">
        <tr className="top-0 sticky">
          <th colSpan={6} className="h-2 bg-white w-full" />
        </tr>
        <thead className="bg-gray-100 sticky top-2 text-left select-none">
          <tr>
            {columns.map((column, index) => {
              const isFirstElement: string | null = index === 0 ? "pl-4 pr-2 rounded-tl-lg rounded-bl-lg" : null;
              const isLastElement: string | null =
                index === columns.length - 1 ? "pr-4 pl-2 rounded-tr-lg rounded-br-lg" : null;

              return (
                <th
                  key={column.key}
                  onClick={() => requestSort(column.key)}
                  className={`cursor-pointer py-3 bg-gray-200 ${isFirstElement ?? isLastElement ?? "px-2"}`}
                >
                  {column.title} <span className="inline-block w-4">{getArrow(column.key, sortConfig)}</span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100 bg-gray-50 rounded-lg transition-all">
              {columns.map((column, index) => {
                const itemVal = item[column.key];
                return (
                  <td
                    key={column.key}
                    className={`py-3 ${classesIfIsFirstElement(index) ?? classesIfIsLastElement(index) ?? "px-2"}`}
                  >
                    {Array.isArray(itemVal)
                      ? itemVal.length
                      : idUppercaseOrValue(column.key, itemVal) ?? blankItemIfNoValue(column.key)}
                    {column.key === "__send__" && <SendMessageContact evaluator={item} fairInfo={fairInfo} />}
                    {column.key === "projects" && <AddProjectToEvaluator evaluator={item} />}
                    {column.key === "evaluators" && <AddEvaluatorToProject />}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <ShowingAllData size={filteredData.length} />
    </div>
  );
}

function SendMessageContact({ evaluator, fairInfo }: Readonly<{ evaluator: Evaluator; fairInfo: ScienceFair }>) {
  const accessLink = `${process.env.NEXT_PUBLIC_APPLICATION_DOMAIN}/avaliador/?code=${evaluator.id}-${fairInfo.fairId}`;
  const message = EVALUATOR_INVITE_MESSAGE.replace("{name}", evaluator?.name)
    .replace("{link}", accessLink)
    .replace("{fair}", fairInfo.fairName)
    .replace("{code}", evaluator.id)
    .replaceAll("{space}", "%0A");
  return (
    <div className="flex space-x-2">
      <div
        className={`p-2 transition-all rounded-md ${evaluator?.phone ? "hover:bg-gray-300 bg-gray-200 cursor-pointer" : "cursor-not-allowed bg-gray-100"}`}
        data-tooltip-id={evaluator?.phone ? "invite-link-messages" : undefined}
        data-tooltip-content="Enviar link de convite pelo WhatsApp"
        data-tooltip-place="left"
        onClick={() => {
          if (evaluator?.phone) {
            window.open(`https://wa.me/55${evaluator?.phone.replace(/\D/g, "")}?text=${message}`, "_blank")?.focus();
          }
        }}
      >
        <FaWhatsapp color={evaluator?.phone ? "black" : "gray"} />
      </div>
      <div
        className={`p-2 transition-all rounded-md ${evaluator?.email ? "hover:bg-gray-300 bg-gray-200 cursor-pointer" : "cursor-not-allowed bg-gray-100"}`}
        data-tooltip-id={evaluator?.email ? "invite-link-messages" : undefined}
        data-tooltip-content="Enviar link de convite pelo Email"
        data-tooltip-place="left"
        onClick={() => {
          if (evaluator?.email) {
            window
              .open(`mailto:${evaluator?.email}?subject=Convite para a ${fairInfo.fairName}&body=${message}`, "_blank")
              ?.focus();
          }
        }}
      >
        <HiOutlineMail color={evaluator?.email ? "black" : "gray"} />
      </div>
      <div
        className="p-2 bg-gray-200 transition-all rounded-md hover:bg-gray-300 cursor-pointer"
        data-tooltip-id="invite-link-messages"
        data-tooltip-content="Copiar link de convite"
        data-tooltip-place="left"
        onClick={() => {
          navigator.clipboard.writeText(accessLink);
          toast.success("Link de convite/login copiado!");
        }}
      >
        <IoMdLink />
      </div>
      <Tooltip id="invite-link-messages" />
    </div>
  );
}

function ShowingAllData({ size }: Readonly<{ size: number }>) {
  return <div className="pb-10 text-center w-full text-gray-500">Exibindo todos os {size} resultados.</div>;
}

type SortValueType = string | undefined | null | Evaluator[] | ProjectForAdmin[] | number;

const isValueNullOrUndefined = (value: SortValueType): boolean => {
  return value === null || value === undefined;
};

const handleNullOrUndefined = (
  aValue: SortValueType,
  bValue: SortValueType,
  direction: "ascending" | "descending",
): number | null => {
  if (isValueNullOrUndefined(aValue) && isValueNullOrUndefined(bValue)) {
    return 0;
  }
  if (isValueNullOrUndefined(aValue)) {
    return direction === "ascending" ? -1 : 1;
  }
  if (isValueNullOrUndefined(bValue)) {
    return direction === "ascending" ? 1 : -1;
  }
  return null; // Use null to indicate that both values are valid for comparison
};

const compareValues = (aValue: SortValueType, bValue: SortValueType, direction: "ascending" | "descending"): number => {
  const nullOrUndefinedComparison = handleNullOrUndefined(aValue, bValue, direction);
  if (nullOrUndefinedComparison !== null) {
    return nullOrUndefinedComparison;
  }

  if ((aValue || "") < (bValue || "")) {
    return direction === "ascending" ? -1 : 1;
  }
  if ((aValue || "") > (bValue || "")) {
    return direction === "ascending" ? 1 : -1;
  }
  return 0;
};
