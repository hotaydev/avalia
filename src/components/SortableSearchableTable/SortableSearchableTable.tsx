import { ProjectForAdmin } from "@/lib/models/project";
import React, { useState, useMemo, ChangeEvent, useEffect } from "react";

interface SortConfig {
  key: keyof ProjectForAdmin;
  direction: "ascending" | "descending";
}

export default function SortableSearchableTable() {
  const [heigth, setHeigth] = useState<number | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({
    key: "id",
    direction: "ascending",
  });

  const data: ProjectForAdmin[] = useMemo(
    () => [
      {
        id: 1,
        title: "Physics",
        description: "Study of matter",
        category: "Ensino Fundamental",
        field: "Science",
        evaluatorsNumber: 5,
      },
      {
        id: 2,
        title: "Biology",
        description: "Study of life",
        category: "Ensino Médio",
        field: "Science",
        evaluatorsNumber: 8,
      },
      {
        id: 3,
        title: "Biology",
        description: "Study of life",
        category: "Ensino Médio",
        field: "Science",
        evaluatorsNumber: 8,
      },
      {
        id: 4,
        title: "Biology",
        description: "Study of life",
        category: "Ensino Médio",
        field: "Science",
        evaluatorsNumber: 8,
      },
      {
        id: 5,
        title: "Biology",
        description: "Study of life",
        category: "Ensino Médio",
        field: "Science",
        evaluatorsNumber: 8,
      },
      {
        id: 6,
        title: "Physics",
        description: "Study of matter",
        category: "Ensino Fundamental",
        field: "Science",
        evaluatorsNumber: 5,
      },
      {
        id: 7,
        title: "Biology",
        description: "Study of life",
        category: "Ensino Médio",
        field: "Science",
        evaluatorsNumber: 8,
      },
      {
        id: 8,
        title: "Biology",
        description: "Study of life",
        category: "Ensino Médio",
        field: "Science",
        evaluatorsNumber: 8,
      },
      {
        id: 9,
        title: "Biology",
        description: "Study of life",
        category: "Ensino Médio",
        field: "Science",
        evaluatorsNumber: 8,
      },
      {
        id: 10,
        title: "Biology",
        description: "Study of life",
        category: "Ensino Médio",
        field: "Science",
        evaluatorsNumber: 8,
      },
      {
        id: 11,
        title: "Biology",
        description: "Study of life",
        category: "Ensino Médio",
        field: "Science",
        evaluatorsNumber: 8,
      },
      {
        id: 12,
        title: "Biology",
        description: "Study of life",
        category: "Ensino Médio",
        field: "Science",
        evaluatorsNumber: 8,
      },
      {
        id: 13,
        title: "Biology",
        description: "Study of life",
        category: "Ensino Médio",
        field: "Science",
        evaluatorsNumber: 8,
      },
    ],
    []
  );

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
      "" ||
      item.field?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ""
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

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getArrow = (key: keyof ProjectForAdmin) => {
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
      {/* TODO: improve this table heigth */}
      {heigth && (
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
                <th
                  onClick={() => requestSort("id")}
                  className="cursor-pointer py-3 pl-4 pr-2 bg-gray-200 rounded-tl-lg rounded-bl-lg"
                >
                  ID <span className="inline-block w-4">{getArrow("id")}</span>
                </th>
                <th
                  onClick={() => requestSort("title")}
                  className="cursor-pointer py-3 px-2 bg-gray-200"
                >
                  Título{" "}
                  <span className="inline-block w-4">{getArrow("title")}</span>
                </th>
                <th
                  onClick={() => requestSort("description")}
                  className="cursor-pointer py-3 px-2 bg-gray-200"
                >
                  Descrição{" "}
                  <span className="inline-block w-4">
                    {getArrow("description")}
                  </span>
                </th>
                <th
                  onClick={() => requestSort("category")}
                  className="cursor-pointer py-3 px-2 bg-gray-200"
                >
                  Categoria{" "}
                  <span className="inline-block w-4">
                    {getArrow("category")}
                  </span>
                </th>
                <th
                  onClick={() => requestSort("field")}
                  className="cursor-pointer py-3 px-2 bg-gray-200"
                >
                  Área do Projeto{" "}
                  <span className="inline-block w-4">{getArrow("field")}</span>
                </th>
                <th
                  onClick={() => requestSort("evaluatorsNumber")}
                  className="cursor-pointer py-3 pl-2 pr-4 bg-gray-200 rounded-tr-lg rounded-br-lg"
                >
                  Avaliadores{" "}
                  <span className="inline-block w-4">
                    {getArrow("evaluatorsNumber")}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-100 bg-gray-50 rounded-lg transition-all"
                >
                  <td className="py-3 pl-4 pr-2 rounded-tl-lg rounded-bl-lg">
                    {item.id}
                  </td>
                  <td className="py-3 px-2">{item.title}</td>
                  <td className="py-3 px-2">{item.description}</td>
                  <td className="py-3 px-2">{item.category}</td>
                  <td className="py-3 px-2">{item.field}</td>
                  <td className="py-3 pr-4 pl-2 rounded-tr-lg rounded-br-lg">
                    {item.evaluatorsNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pb-10 text-center w-full text-gray-500">
            Exibindo todos os {filteredData.length} resultados.
          </div>
        </div>
      )}
    </div>
  );
}
