"use client";

import { useMemo, useState } from "react";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";
import { CourseRegistration } from "@/types";

interface AdminRegistrationsTableProps {
  registrations: CourseRegistration[];
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
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Хүлээгдэж буй",
    },
    confirmed: {
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Баталгаажсан",
    },
    cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Цуцлагдсан" },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

export default function AdminRegistrationsTable({
  registrations,
  searchQuery,
  onSearchChange,
  onUpdate,
}: AdminRegistrationsTableProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdateStatus = async (
    registrationId: string,
    newStatus: string
  ) => {
    setLoading(registrationId);
    try {
      const token = localStorage.getItem("token");
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/registrations/${registrationId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        },
        token!
      );

      if (response.ok) {
        onUpdate();
        alert("Бүртгэлийн статус амжилттай шинэчлэгдлээ!");
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error updating registration status:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(null);
    }
  };

  const filtered = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return registrations.filter((reg) => {
      if (!normalizedQuery) return true;
      return [
        reg.user.firstName,
        reg.user.lastName,
        reg.user.email,
        reg.user.phoneNumber,
        reg.user.userCode,
        reg.course.title,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });
  }, [registrations, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: filtered.length,
      pending: filtered.filter((r) => r.status === "pending").length,
      confirmed: filtered.filter((r) => r.status === "confirmed").length,
      cancelled: filtered.filter((r) => r.status === "cancelled").length,
    };
  }, [filtered]);

  return (
    <section className="space-y-6">
      <header className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Сургалтын бүртгэлүүд
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Нийт {stats.total} бүртгэл ({stats.pending} хүлээгдэж буй,{" "}
              {stats.confirmed} баталгаажсан, {stats.cancelled} цуцлагдсан)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Хэрэглэгч, сургалтаар хайх"
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
                Сургалт
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Статус
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
                  Таарах бүртгэл олдсонгүй.
                </td>
              </tr>
            ) : (
              filtered.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50/70">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {registration.user.firstName} {registration.user.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {registration.user.email}
                    </div>
                    {registration.user.userCode && (
                      <div className="text-xs text-gray-400">
                        ID: {registration.user.userCode}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {registration.course.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {registration.course.level} •{" "}
                      {registration.course.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(registration.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(registration.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {registration.status !== "confirmed" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(registration.id, "confirmed")
                          }
                          className="text-sm font-medium text-green-600 hover:text-green-700"
                          disabled={loading === registration.id}
                        >
                          Баталгаажуулах
                        </button>
                      )}
                      {registration.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(registration.id, "cancelled")
                          }
                          className="text-sm font-medium text-red-600 hover:text-red-800"
                          disabled={loading === registration.id}
                        >
                          Цуцлах
                        </button>
                      )}
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
            <p className="text-gray-400">Таарах бүртгэл олдсонгүй.</p>
          </div>
        ) : (
          filtered.map((registration) => (
            <div
              key={registration.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {registration.user.firstName} {registration.user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {registration.user.email}
                  </p>
                  {registration.user.userCode && (
                    <p className="text-xs text-gray-400">
                      ID: {registration.user.userCode}
                    </p>
                  )}
                </div>
                {getStatusBadge(registration.status)}
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Сургалт:</p>
                  <p className="text-sm text-gray-900">
                    {registration.course.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {registration.course.level} • {registration.course.duration}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Бүртгүүлсэн огноо:
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(registration.createdAt)}
                  </p>
                </div>
                {registration.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Тэмдэглэл:
                    </p>
                    <p className="text-sm text-gray-600">
                      {registration.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {registration.status !== "confirmed" && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(registration.id, "confirmed")
                    }
                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                    disabled={loading === registration.id}
                  >
                    Баталгаажуулах
                  </button>
                )}
                {registration.status !== "cancelled" && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(registration.id, "cancelled")
                    }
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                    disabled={loading === registration.id}
                  >
                    Цуцлах
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
