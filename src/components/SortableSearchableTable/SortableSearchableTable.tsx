import { ProjectForAdmin } from "@/lib/models/project";
import React, { useState, useMemo, ChangeEvent } from "react";

interface SortConfig {
  key: keyof ProjectForAdmin;
  direction: "ascending" | "descending";
}

export default function SortableSearchableTable() {
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
      <div className="overflow-auto max-h-[400px] border-gray-300 rounded-lg pr-3">
        <table className="table-auto min-w-full sticky top-0">
          <thead className="bg-gray-200 text-left tracking-wider">
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
                <span className="inline-block w-4">{getArrow("category")}</span>
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
        </table>
        <table className="table-auto min-w-full border-spacing-y-2 border-separate">
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-200 bg-gray-100 rounded-lg transition-all"
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
      </div>
    </div>
  );
}
