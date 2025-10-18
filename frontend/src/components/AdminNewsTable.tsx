"use client";

import { useMemo, useState } from "react";
import { News } from "@/types";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";

interface AdminNewsTableProps {
  news: News[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEdit: (news: News) => void;
  onToggleStatus: (news: News) => Promise<void>;
  onAdd: () => void;
  onUpdate: () => void;
}

const formatDate = (value: string) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
};

export default function AdminNewsTable({
  news,
  searchQuery,
  onSearchChange,
  onEdit,
  onToggleStatus,
  onAdd,
  onUpdate,
}: AdminNewsTableProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (newsItem: News) => {
    if (!confirm(`"${newsItem.title}" мэдээг устгахдаа итгэлтэй байна уу?`)) {
      return;
    }

    setLoading(newsItem.id);
    try {
      const token = localStorage.getItem("token");
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/news/${newsItem.id}`,
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
      console.error("Error deleting news:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(null);
    }
  };

  const { filtered, activeCount } = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredItems = news.filter((item) => {
      if (!normalizedQuery) return true;
      return [item.title, item.author, formatDate(item.publishDate)]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });

    return {
      filtered: filteredItems,
      activeCount: filteredItems.filter((item) => item.isActive).length,
    };
  }, [news, searchQuery]);

  return (
    <section className="space-y-6">
      <header className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Мэдээ</h2>
            <p className="text-sm text-gray-500 mt-1">
              Нийт {filtered.length} мэдээ, {activeCount} идэвхтэй байна.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Гарчиг, зохиогчоор хайх"
              className="w-full sm:w-64 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={onAdd}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-sm hover:from-blue-700 hover:to-purple-700 transition"
            >
              Шинэ мэдээ нэмэх
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
                Зохиогч
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Огноо
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
                  Таарах мэдээ олдсонгүй.
                </td>
              </tr>
            ) : (
              filtered.map((newsItem) => (
                <tr key={newsItem.id} className="hover:bg-gray-50/70">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {newsItem.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {newsItem.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {newsItem.author || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(newsItem.publishDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                        newsItem.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {newsItem.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => onEdit(newsItem)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        disabled={loading === newsItem.id}
                      >
                        Засварлах
                      </button>
                      <button
                        onClick={() => onToggleStatus(newsItem)}
                        className="text-sm font-medium text-gray-600 hover:text-gray-800"
                        disabled={loading === newsItem.id}
                      >
                        {newsItem.isActive
                          ? "Идэвхгүй болгох"
                          : "Идэвхтэй болгох"}
                      </button>
                      <button
                        onClick={() => handleDelete(newsItem)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                        disabled={loading === newsItem.id}
                      >
                        {loading === newsItem.id ? "Устгаж байна..." : "Устгах"}
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
            <p className="text-gray-400">Таарах мэдээ олдсонгүй.</p>
          </div>
        ) : (
          filtered.map((newsItem) => (
            <div
              key={newsItem.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {newsItem.title}
                  </h3>
                  <div className="text-sm text-gray-500 mt-2 line-clamp-3">
                    {newsItem.content}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                    newsItem.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {newsItem.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Зохиогч:</span>{" "}
                    {newsItem.author || "Тодорхойгүй"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Огноо:</span>{" "}
                    {formatDate(newsItem.publishDate)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => onEdit(newsItem)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                  disabled={loading === newsItem.id}
                >
                  Засварлах
                </button>
                <button
                  onClick={() => onToggleStatus(newsItem)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                  disabled={loading === newsItem.id}
                >
                  {newsItem.isActive ? "Идэвхгүй болгох" : "Идэвхтэй болгох"}
                </button>
                <button
                  onClick={() => handleDelete(newsItem)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                  disabled={loading === newsItem.id}
                >
                  {loading === newsItem.id ? "Устгаж байна..." : "Устгах"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
