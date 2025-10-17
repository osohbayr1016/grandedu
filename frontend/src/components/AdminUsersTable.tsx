"use client";

import { useMemo, useState } from "react";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";
import type { User } from "@/types";

interface AdminUsersTableProps {
  users: User[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
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

export default function AdminUsersTable({
  users,
  searchQuery,
  onSearchChange,
  onUpdate,
}: AdminUsersTableProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleRole = async (user: User) => {
    if (
      !confirm(
        `${user.firstName} ${user.lastName}-ийн эрхийг ${
          user.role === "admin" ? "хэрэглэгч" : "админ"
        } болгох уу?`
      )
    ) {
      return;
    }

    setLoading(user.id);
    try {
      const token = localStorage.getItem("token");
      const newRole = user.role === "admin" ? "user" : "admin";

      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/auth/users/${user.id}/role`,
        {
          method: "PATCH",
          body: JSON.stringify({ role: newRole }),
        },
        token!
      );

      if (response.ok) {
        onUpdate();
        alert("Хэрэглэгчийн эрхийг амжилттай өөрчиллөө!");
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(null);
    }
  };

  const handleToggleHighlight = async (user: User) => {
    setLoading(user.id);
    try {
      const token = localStorage.getItem("token");

      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/auth/users/${user.id}/highlight`,
        {
          method: "PATCH",
        },
        token!
      );

      if (response.ok) {
        onUpdate();
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error highlighting user:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(null);
    }
  };

  const { filtered, adminCount, highlightedCount } = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredItems = users.filter((user) => {
      if (!normalizedQuery) return true;
      return [
        user.firstName,
        user.lastName,
        user.email,
        user.phoneNumber,
        user.userCode,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });

    return {
      filtered: filteredItems,
      adminCount: filteredItems.filter((item) => item.role === "admin").length,
      highlightedCount: filteredItems.filter((item) => item.isHighlighted)
        .length,
    };
  }, [users, searchQuery]);

  return (
    <section className="space-y-6">
      <header className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Хэрэглэгчид
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Нийт {filtered.length} хэрэглэгч, {adminCount} админ,{" "}
              {highlightedCount} онцолсон.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Нэр, имэйл, утсаар хайх"
              className="w-full sm:w-64 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Хэрэглэгч
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Холбоо барих
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Эрх
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Огноо
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
                  Таарах хэрэглэгч олдсонгүй.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/70">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.firstName.charAt(0).toUpperCase()}
                          {user.lastName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {user.userCode}
                        </div>
                      </div>
                    </div>
                    {user.isHighlighted && (
                      <span className="ml-14 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 mt-1">
                        ⭐ Онцолсон
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-500">
                      {user.phoneNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role === "admin" ? "👑 Админ" : "👤 Хэрэглэгч"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => handleToggleRole(user)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        disabled={loading === user.id}
                      >
                        {user.role === "admin"
                          ? "Хэрэглэгч болгох"
                          : "Админ болгох"}
                      </button>
                      <button
                        onClick={() => handleToggleHighlight(user)}
                        className={`text-sm font-medium ${
                          user.isHighlighted
                            ? "text-yellow-600 hover:text-yellow-700"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                        disabled={loading === user.id}
                      >
                        {user.isHighlighted ? "Онцлохыг цуцлах" : "Онцлох"}
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
            <p className="text-gray-400">Таарах хэрэглэгч олдсонгүй.</p>
          </div>
        ) : (
          filtered.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-base font-semibold">
                      {user.firstName.charAt(0).toUpperCase()}
                      {user.lastName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">ID: {user.userCode}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role === "admin" ? "👑 Админ" : "👤 Хэрэглэгч"}
                </span>
              </div>

              {user.isHighlighted && (
                <div className="mb-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                    ⭐ Онцолсон
                  </span>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Имэйл:</span> {user.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Утас:</span> {user.phoneNumber}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Бүртгэлийн огноо:</span>{" "}
                  {formatDate(user.createdAt)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleToggleRole(user)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                  disabled={loading === user.id}
                >
                  {user.role === "admin" ? "Хэрэглэгч болгох" : "Админ болгох"}
                </button>
                <button
                  onClick={() => handleToggleHighlight(user)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                  disabled={loading === user.id}
                >
                  {user.isHighlighted ? "Онцлохыг цуцлах" : "Онцлох"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
