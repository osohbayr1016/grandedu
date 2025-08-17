"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getUniversitiesUrl } from "@/utils/api";

interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchUniversity();
  }, [params.id, router, user, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUniversity = async () => {
    try {
      const universityId = params.id as string;
      const response = await fetch(`${getUniversitiesUrl()}/${universityId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUniversity(data);
      } else {
        console.error("Failed to fetch university");
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error fetching university:", error);
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleSave = async () => {
    if (!editingField || !university) return;

    setSaving(true);
    try {
      const response = await fetch(`${getUniversitiesUrl()}/${university.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...university,
          [editingField]: editValue,
        }),
      });

      if (response.ok) {
        const updatedUniversity = await response.json();
        setUniversity(updatedUniversity);
        setEditingField(null);
        setEditValue("");
      } else {
        console.error("Failed to update university");
        alert("Хадгалахад алдаа гарлаа");
      }
    } catch (error) {
      console.error("Хадгалахад алдаа гарлаа:", error);
      alert("Хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleToggleStatus = async () => {
    if (!university) return;

    try {
      const response = await fetch(
        `${getUniversitiesUrl()}/${university.id}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const updatedUniversity = await response.json();
        setUniversity(updatedUniversity);
      } else {
        console.error("Failed to toggle university status");
        alert("Төлөв өөрчлөхөд алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Төлөв өөрчлөхөд алдаа гарлаа");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div
              className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Их сургуулийн мэдээлэл ачаалж байна
            </h3>
            <p className="text-gray-600 mt-1">Түр хүлээнэ үү...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Их сургууль олдсонгүй</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Top Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">
                grandedu.mn/admin
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {user.firstName.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user.firstName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Enhanced Left Sidebar */}
        <div className="w-72 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 min-h-screen shadow-lg">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GrandEdu
                </h2>
                <p className="text-xs text-gray-500">Админ удирдлага</p>
              </div>
            </div>

            <nav className="space-y-3">
              <button
                onClick={() => router.push("/admin")}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Админ самбар</div>
                    <div className="text-xs text-gray-500">
                      Үндсэн хянах самбар
                    </div>
                  </div>
                </div>
              </button>
              <div className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-blue-700">
                      Их сургуулиуд
                    </div>
                    <div className="text-xs text-blue-600">
                      Өөрчлөлт хийж байна
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Enhanced User Profile Section */}
            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user.firstName.charAt(0)}
                      {user.lastName?.charAt(0) || ""}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-600">{user.email}</div>
                    <div className="text-xs text-green-600 font-medium">
                      ● Онлайн
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push("/")}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Вэбсайт руу буцах</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex-1 p-8 max-w-5xl">
          {/* Enhanced Header with Breadcrumbs */}
          <div className="mb-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <button
                onClick={() => router.push("/admin")}
                className="hover:text-blue-600 transition-colors"
              >
                Админ самбар
              </button>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-gray-700 font-medium">Их сургуулиуд</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-blue-600 font-medium">
                {university.name}
              </span>
            </nav>

            {/* Header Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {university.name}
                      </h1>
                      <p className="text-gray-600 mt-1 flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>{university.location}</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-3 max-w-2xl">
                    Их сургуулийн дэлгэрэнгүй мэдээллийг засварлах, статус
                    өөрчлөх болон бусад тохиргоо хийх
                  </p>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <button
                    onClick={handleToggleStatus}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      university.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        university.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span>{university.isActive ? "Идэвхтэй" : "Идэвхгүй"}</span>
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/universities/${university.id}`)
                    }
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>Харах</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Үндсэн мэдээлэл
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Их сургуулийн нэр
                </label>
                {editingField === "name" ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:opacity-50"
                      >
                        {saving ? "Хадгалж байна..." : "Хадгалах"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                      >
                        Цуцлах
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-900">{university.name}</p>
                    <button
                      onClick={() => startEditing("name", university.name)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Засах
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Байршил
                </label>
                {editingField === "location" ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:opacity-50"
                      >
                        {saving ? "Хадгалж байна..." : "Хадгалах"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                      >
                        Цуцлах
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-900">{university.location}</p>
                    <button
                      onClick={() =>
                        startEditing("location", university.location)
                      }
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Засах
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тайлбар
                </label>
                {editingField === "description" ? (
                  <div className="space-y-2">
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:opacity-50"
                      >
                        {saving ? "Хадгалж байна..." : "Хадгалах"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                      >
                        Цуцлах
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <p className="text-gray-900 flex-1">
                      {university.description}
                    </p>
                    <button
                      onClick={() =>
                        startEditing("description", university.description)
                      }
                      className="text-blue-600 hover:text-blue-700 text-sm ml-4"
                    >
                      Засах
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Зургийн URL
                </label>
                {editingField === "imageUrl" ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:opacity-50"
                      >
                        {saving ? "Хадгалж байна..." : "Хадгалах"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                      >
                        Цуцлах
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-900">{university.imageUrl}</p>
                    <button
                      onClick={() =>
                        startEditing("imageUrl", university.imageUrl)
                      }
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Засах
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Нэмэлт мэдээлэл
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Үүсгэсэн огноо
                </label>
                <p className="text-gray-900">
                  {new Date(university.createdAt).toLocaleDateString("mn-MN")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сүүлд засварласан
                </label>
                <p className="text-gray-900">
                  {new Date(university.updatedAt).toLocaleDateString("mn-MN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
