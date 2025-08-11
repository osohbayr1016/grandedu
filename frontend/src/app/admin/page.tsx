"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  getContentUrl,
  getHomeContentUrl,
  getProgramsContentUrl,
  getNavigationContentUrl,
} from "@/utils/api";

interface PageContent {
  id: string;
  page: string;
  section: string;
  field: string;
  content: string;
  type: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GroupedContent {
  [section: string]: {
    [field: string]: string;
  };
}

interface DashboardStats {
  totalUsers: number;
  totalPrograms: number;
  totalNews: number;
  totalUniversities: number;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<PageContent[]>([]);
  const [groupedContent, setGroupedContent] = useState<GroupedContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("navigation");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPrograms: 0,
    totalNews: 0,
    totalUniversities: 0,
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchContent();
    fetchStats();
  }, [user, authLoading, router]);

  const fetchContent = async () => {
    try {
      const response = await fetch(getContentUrl(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setContent(data);

        // Хэсгүүдээр контентийг бүлэглэх
        const grouped = data.reduce(
          (acc: GroupedContent, item: PageContent) => {
            if (!acc[item.section]) {
              acc[item.section] = {};
            }
            acc[item.section][item.field] = item.content;
            return acc;
          },
          {}
        );
        setGroupedContent(grouped);
      }
    } catch (error) {
      console.error("Контент татахад алдаа гарлаа:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Хөтөлбөрийн тоог татах
      const programsResponse = await fetch(
        `${getContentUrl()}/programs/count`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (programsResponse.ok) {
        const programsData = await programsResponse.json();
        setStats((prev) => ({
          ...prev,
          totalPrograms: programsData.count || 0,
        }));
      }

      // Хэрэглэгчдийн тоог татах (хэрэв боломжтой бол)
      const usersResponse = await fetch(`${getContentUrl()}/users/count`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setStats((prev) => ({ ...prev, totalUsers: usersData.count || 0 }));
      }
    } catch (error) {
      console.error("Статистик татахад алдаа гарлаа:", error);
    }
  };

  const saveContent = async (
    section: string,
    field: string,
    content: string
  ) => {
    setSaving(true);
    try {
      const response = await fetch(getContentUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          page: "home",
          section,
          field,
          content,
          type: "text",
        }),
      });

      if (response.ok) {
        await fetchContent();
        setEditingField(null);
      }
    } catch (error) {
      console.error("Контент хадгалахад алдаа гарлаа:", error);
    } finally {
      setSaving(false);
    }
  };

  const toggleContentStatus = async (id: string) => {
    try {
      const response = await fetch(`${getContentUrl()}/${id}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        await fetchContent();
      }
    } catch (error) {
      console.error("Контент төлөв өөрчлөхөд алдаа гарлаа:", error);
    }
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleSave = () => {
    if (editingField) {
      saveContent(activeSection, editingField, editValue);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  // Зөвхөн GrandEdu вэбсайтад байгаа хэсгүүдийг харуулах
  const sections = [
    {
      id: "navigation",
      name: "Хэлний сан",
      icon: "🌐",
      description: "Вэбсайтын хэлний сан, цэс, товчнууд",
    },
    {
      id: "hero",
      name: "Үндсэн хэсэг",
      icon: "🏠",
      description: "Нүүр хуудасны гол загвар, гарчиг, тайлбар",
    },
    {
      id: "news",
      name: "Мэдээ",
      icon: "📰",
      description: "Мэдээний хэсгийн загвар, гарчиг, тайлбар",
    },
    {
      id: "programs",
      name: "Хөтөлбөрүүд",
      icon: "📚",
      description: "Хөтөлбөрийн хэсгийн загвар, гарчиг, тайлбар",
    },
    {
      id: "universities",
      name: "Их сургуулиуд",
      icon: "🎓",
      description: "Их сургуулийн хэсгийн загвар, гарчиг, тайлбар",
    },
  ];

  const filteredFields = useMemo(() => {
    const items = groupedContent[activeSection] || {};
    const entries = Object.entries(items);
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter(([field, value]) => {
      const label = field
        .replace(/([A-Z])/g, " $1")
        .replace(/[-_]/g, " ")
        .toLowerCase();
      return label.includes(q) || String(value).toLowerCase().includes(q);
    });
  }, [groupedContent, activeSection, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Админ самбарыг ачаалж байна...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">grandedu.mn/admin</div>
          <div className="text-sm text-gray-600">Админ: {user.firstName}</div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              GrandEdu Админ
            </h2>

            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{section.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{section.name}</div>
                      <div className="text-xs text-gray-500">
                        {section.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>

            {/* User Profile Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-3 py-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => router.push("/")}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 mt-2"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Вэбсайт руу буцах</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {sections.find((s) => s.id === activeSection)?.name}
            </h1>
            <p className="text-gray-600">
              {sections.find((s) => s.id === activeSection)?.description}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </div>
                  <div className="text-sm text-gray-600">Нийт хэрэглэгч</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalPrograms}
                  </div>
                  <div className="text-sm text-gray-600">Нийт хөтөлбөр</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalNews}
                  </div>
                  <div className="text-sm text-gray-600">Нийт мэдээ</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalUniversities}
                  </div>
                  <div className="text-sm text-gray-600">Нийт их сургууль</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-3 sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {sections.find((s) => s.id === activeSection)?.name} - Контент
                  засвар
                </h2>
                <p className="text-gray-500 text-sm">
                  Энэ хэсгийн бүх текст, гарчиг, тайлбарыг засварлана
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Талбар эсвэл контентийг хайх"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔎
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {groupedContent[activeSection] ? (
                filteredFields.map(([field, value]) => {
                  const contentItem = content.find(
                    (item) =>
                      item.section === activeSection && item.field === field
                  );

                  return (
                    <div
                      key={field}
                      className="border border-gray-200 rounded-lg p-5"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {field.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                        {contentItem && (
                          <button
                            onClick={() => toggleContentStatus(contentItem.id)}
                            role="switch"
                            aria-checked={contentItem.isActive}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              contentItem.isActive
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                            title={
                              contentItem.isActive ? "Идэвхтэй" : "Идэвхгүй"
                            }
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                contentItem.isActive
                                  ? "translate-x-4"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {editingField === field ? (
                        <div className="space-y-3">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSave}
                              disabled={saving}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                            >
                              {saving ? "Хадгалж байна..." : "Хадгалах"}
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm"
                            >
                              Цуцлах
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-gray-900 whitespace-pre-wrap">
                              {value}
                            </p>
                          </div>
                          <button
                            onClick={() => startEditing(field, value)}
                            className="ml-4 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            Засах
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Энэ хэсэгт контент олдсонгүй. Backend-тэй холбогдоно уу.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
