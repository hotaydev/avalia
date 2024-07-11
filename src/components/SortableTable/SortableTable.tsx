import { Evaluator } from "@/lib/models/evaluator";
import { ProjectForAdmin } from "@/lib/models/project";
import React, { useState, useMemo, ChangeEvent, useEffect } from "react";

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
  key: keyof Evaluator;
  title: string;
}[] = [
  { key: "id", title: "ID" },
  { key: "name", title: "Nome" },
  { key: "email", title: "E-mail" },
  { key: "phone", title: "Telefone" },
  { key: "field", title: "Área de Atuação" },
  { key: "projects", title: "Projetos" },
];

const projectsTableColumns: {
  key: keyof ProjectForAdmin;
  title: string;
}[] = [
  { key: "id", title: "ID" },
  { key: "title", title: "Título" },
  // { key: "description", title: "Descrição" },
  { key: "category", title: "Categoria" },
  { key: "field", title: "Área do Projeto" },
  { key: "score", title: "Nota atual" },
  { key: "evaluatorsNumber", title: "Avaliadores" },
];

export default function SortableTable({
  table,
}: Readonly<{ table: "evaluators" | "projects" }>) {
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
    const componentHeight =
      document.getElementById("tableAvailableArea")?.clientHeight;
    setHeigth(componentHeight ?? 300);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getArrow = (key: string, sortConfig: SortConfig) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return " "; // Non-breaking space
  };

  return (
    <div className="pl-4 py-4 pr-1">
      <input
        type="text"
        placeholder="Pesquisar..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border border-gray-300 rounded-lg"
      />
      {heigth &&
        (table === "evaluators" ? (
          <EvaluatorsTable
            heigth={heigth}
            searchTerm={searchTerm}
            getArrow={getArrow}
          />
        ) : (
          <ProjectsTable
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
}: Readonly<{ heigth: number; searchTerm: string; getArrow: Function }>) {
  const [sortConfig, setSortConfig] = useState<SortConfigForEvaluators>({
    key: "id",
    direction: "ascending",
  });
  const [data, setData] = useState<Evaluator[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      fetch("/api/admin/evaluators/")
        .then((res) => res.json())
        .then(async (data) => {
          if (isMounted) setData(data);
        });
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const sortedData: Evaluator[] = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (
          aValue === null ||
          (aValue === undefined && bValue === null) ||
          bValue === undefined
        ) {
          return 0;
        }
        if (aValue === null || aValue === undefined) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (bValue === null || bValue === undefined) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const filteredData = sortedData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.field?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key: keyof Evaluator) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
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
}: Readonly<{ heigth: number; searchTerm: string; getArrow: Function }>) {
  const [sortConfig, setSortConfig] = useState<SortConfigForProjects>({
    key: "id",
    direction: "ascending",
  });
  const [data, setData] = useState<ProjectForAdmin[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      fetch("/api/admin/projects/")
        .then((res) => res.json())
        .then(async (data) => {
          if (isMounted) setData(data);
        });
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const sortedData: ProjectForAdmin[] = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (
          aValue === null ||
          (aValue === undefined && bValue === null) ||
          bValue === undefined
        ) {
          return 0;
        }
        if (aValue === null || aValue === undefined) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (bValue === null || bValue === undefined) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const filteredData = sortedData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.field?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key: keyof ProjectForAdmin) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
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
  filteredData: any[];
  heigth: number;
  columns: { key: string; title: string }[];
  getArrow: Function;
  sortConfig: SortConfig | SortConfigForEvaluators | SortConfigForProjects;
  requestSort: Function;
}>) {
  return (
    <div
      className="overflow-auto rounded-lg pr-3"
      style={{
        maxHeight: heigth * 0.7,
        maskImage:
          "linear-gradient(to bottom, black calc(100% - 32px), transparent 100%)",
      }}
    >
      <table className="table-auto min-w-full pb-6 border-separate border-spacing-y-2">
        <tr className="top-0 sticky">
          <th colSpan={6} className="h-2 bg-white w-full"></th>
        </tr>
        <thead className="bg-gray-100 sticky top-2 text-left select-none">
          <tr>
            {columns.map((column, index) => {
              const isFirstElement: string | null =
                index === 0 ? "pl-4 pr-2 rounded-tl-lg rounded-bl-lg" : null;
              const isLastElement: string | null =
                index === columns.length - 1
                  ? "pr-4 pl-2 rounded-tr-lg rounded-br-lg"
                  : null;

              return (
                <th
                  key={column.key}
                  onClick={() => requestSort(column.key)}
                  className={`cursor-pointer py-3 bg-gray-200 ${
                    isFirstElement ?? isLastElement ?? "px-2"
                  }`}
                >
                  {column.title}{" "}
                  <span className="inline-block w-4">
                    {getArrow(column.key, sortConfig)}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-100 bg-gray-50 rounded-lg transition-all"
            >
              {columns.map((column, index) => {
                const isFirstElement: string | null =
                  index === 0 ? "pl-4 pr-2 rounded-tl-lg rounded-bl-lg" : null;
                const isLastElement: string | null =
                  index === columns.length - 1
                    ? "pr-4 pl-2 rounded-tr-lg rounded-br-lg"
                    : null;

                return (
                  <td
                    key={column.key}
                    className={`py-3 ${
                      isFirstElement ?? isLastElement ?? "px-2"
                    }`}
                  >
                    {item[column.key] ?? "---"}
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

function ShowingAllData({ size }: Readonly<{ size: number }>) {
  return (
    <div className="pb-10 text-center w-full text-gray-500">
      Exibindo todos os {size} resultados.
    </div>
  );
}