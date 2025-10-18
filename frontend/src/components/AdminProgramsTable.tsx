"use client";

import { useMemo, useState } from "react";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price?: string;
  location?: string;
  university?: string;
  requirements?: string;
  imageUrl?: string;
  googleFormLink?: string;
  isHighlighted: boolean;
  isActive: boolean;
  adminNote?: string;
}

interface AdminProgramsTableProps {
  programs: Program[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEdit: (program: Program) => void;
  onToggleStatus: (program: Program) => Promise<void>;
  onAdd: () => void;
  onUpdate: () => void;
}

export default function AdminProgramsTable({
  programs,
  searchQuery,
  onSearchChange,
  onEdit,
  onToggleStatus,
  onAdd,
  onUpdate,
}: AdminProgramsTableProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (program: Program) => {
    if (
      !confirm(`"${program.title}" хөтөлбөрийг устгахдаа итгэлтэй байна уу?`)
    ) {
      return;
    }

    setLoading(program.id);
    try {
      const token = localStorage.getItem("token");
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/programs/${program.id}`,
        {
          method: "DELETE",
        },
        token!
      );

      if (response.ok) {
        onUpdate();
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error deleting program:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(null);
    }
  };

  const { filtered, activeCount, highlightedCount } = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredItems = programs.filter((program) => {
      if (!normalizedQuery) return true;
      return [
        program.title,
        program.level,
        program.duration,
        program.description,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });

    return {
      filtered: filteredItems,
      activeCount: filteredItems.filter((item) => item.isActive).length,
      highlightedCount: filteredItems.filter((item) => item.isHighlighted)
        .length,
    };
  }, [programs, searchQuery]);

  return (
    <section className="space-y-6">
      <header className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Хөтөлбөрүүд
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Нийт {filtered.length} хөтөлбөр, {activeCount} идэвхтэй,{" "}
              {highlightedCount} онцолсон.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Хөтөлбөрийн нэр, түвшин, хугацаагаар хайх"
              className="w-full sm:w-64 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={onAdd}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-sm hover:from-blue-700 hover:to-purple-700 transition"
            >
              Шинэ хөтөлбөр нэмэх
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
                Гарчиг
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Түвшин
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Хугацаа
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
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-400 text-sm"
                >
                  Таарах хөтөлбөр олдсонгүй.
                </td>
              </tr>
            ) : (
              filtered.map((program) => (
                <tr key={program.id} className="hover:bg-gray-50/70">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {program.title}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      {program.isHighlighted && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                          Онцолсон
                        </span>
                      )}
                      {program.adminNote && (
                        <span className="text-gray-500">
                          {program.adminNote}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {program.level || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {program.duration || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                        program.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {program.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => onEdit(program)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        disabled={loading === program.id}
                      >
                        Засварлах
                      </button>
                      <button
                        onClick={() => onToggleStatus(program)}
                        className="text-sm font-medium text-gray-600 hover:text-gray-800"
                        disabled={loading === program.id}
                      >
                        {program.isActive
                          ? "Идэвхгүй болгох"
                          : "Идэвхтэй болгох"}
                      </button>
                      <button
                        onClick={() => handleDelete(program)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                        disabled={loading === program.id}
                      >
                        {loading === program.id ? "Устгаж байна..." : "Устгах"}
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
            <p className="text-gray-400">Таарах хөтөлбөр олдсонгүй.</p>
          </div>
        ) : (
          filtered.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {program.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {program.isHighlighted && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                        Онцолсон
                      </span>
                    )}
                    {program.adminNote && (
                      <span className="text-xs text-gray-500">
                        {program.adminNote}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                    program.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {program.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Түвшин:</span>{" "}
                    {program.level || "Тодорхойгүй"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Хугацаа:</span>{" "}
                    {program.duration || "Тодорхойгүй"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => onEdit(program)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                  disabled={loading === program.id}
                >
                  Засварлах
                </button>
                <button
                  onClick={() => onToggleStatus(program)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                  disabled={loading === program.id}
                >
                  {program.isActive ? "Идэвхгүй болгох" : "Идэвхтэй болгох"}
                </button>
                <button
                  onClick={() => handleDelete(program)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                  disabled={loading === program.id}
                >
                  {loading === program.id ? "Устгаж байна..." : "Устгах"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
