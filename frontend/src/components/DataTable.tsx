"use client";

import { useState } from "react";

interface DataTableProps<T = Record<string, unknown>> {
  title: string;
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
  }>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onToggleStatus?: (item: T) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  addButtonText?: string;
  onAdd?: () => void;
  emptyMessage?: string;
}

export default function DataTable<T = Record<string, unknown>>({
  title,
  data,
  columns,
  onEdit,
  onDelete,
  onToggleStatus,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Хайх...",
  addButtonText = "Нэмэх",
  onAdd,
  emptyMessage = "Мэдээлэл олдсонгүй",
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((item) =>
    Object.values(item as Record<string, unknown>).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {onAdd && (
            <button
              onClick={onAdd}
              className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {addButtonText}
            </button>
          )}
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortField === column.key && (
                      <span className="text-blue-600">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onToggleStatus) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key])}
                    </td>
                  ))}
                  {(onEdit || onDelete || onToggleStatus) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Засах
                          </button>
                        )}
                        {onToggleStatus && (
                          <button
                            onClick={() => onToggleStatus(item)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Тоглох
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Устгах
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (onEdit || onDelete || onToggleStatus ? 1 : 0)
                  }
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
