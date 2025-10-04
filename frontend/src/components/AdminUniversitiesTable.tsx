"use client";

import { useMemo } from "react";
import { Entity, University } from "@/types";

interface AdminUniversitiesTableProps {
  universities: Entity[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEdit: (university: University) => void;
  onToggleStatus: (university: University) => Promise<void>;
  onAdd: () => void;
}

export default function AdminUniversitiesTable({
  universities,
  searchQuery,
  onSearchChange,
  onEdit,
  onToggleStatus,
  onAdd,
}: AdminUniversitiesTableProps) {
  const { filtered, activeCount } = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredItems = universities.filter((university) => {
      if (!normalizedQuery) return true;
      return [university.name, university.location, university.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });

    const activeTotal = filteredItems.filter((item) => item.isActive).length;

    return {
      filtered: filteredItems,
      activeCount: activeTotal,
    };
  }, [universities, searchQuery]);

  return (
    <section className="space-y-6">
      <header className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Их сургуулиудын жагсаалт
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Нийт {filtered.length} сургууль, {activeCount} идэвхтэй байна.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Сургуулиа нэр, байршлаар хайх"
              className="w-full sm:w-64 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={onAdd}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-sm hover:from-blue-700 hover:to-purple-700 transition"
            >
              Шинэ сургууль нэмэх
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Нэр
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Байршил
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Статус
              </th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-400 text-sm"
                >
                  Таарах сургууль олдсонгүй.
                </td>
              </tr>
            ) : (
              filtered.map((university) => (
                <tr key={university.id} className="hover:bg-gray-50/70">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {university.name}
                    </div>
                    {university.adminNote && (
                      <div className="text-xs text-gray-500 mt-1">
                        {university.adminNote}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {university.location || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                        university.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {university.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => onEdit(university as University)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Засварлах
                      </button>
                      <button
                        onClick={() => onToggleStatus(university as University)}
                        className="text-sm font-medium text-gray-600 hover:text-gray-800"
                      >
                        {university.isActive
                          ? "Идэвхгүй болгох"
                          : "Идэвхтэй болгох"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 text-center">
            <p className="text-gray-400">Таарах сургууль олдсонгүй.</p>
          </div>
        ) : (
          filtered.map((university) => (
            <div
              key={university.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {university.name}
                  </h3>
                  {university.adminNote && (
                    <p className="text-sm text-gray-500 mt-1">
                      {university.adminNote}
                    </p>
                  )}
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                    university.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {university.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Байршил:</span>{" "}
                  {university.location || "Тодорхойгүй"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => onEdit(university as University)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  Засварлах
                </button>
                <button
                  onClick={() => onToggleStatus(university as University)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  {university.isActive ? "Идэвхгүй болгох" : "Идэвхтэй болгох"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
