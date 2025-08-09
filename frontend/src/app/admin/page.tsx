"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getContentUrl } from "@/utils/api";

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

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchContent();
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

        // Group content by section
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
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
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
      console.error("Error saving content:", error);
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
      console.error("Error toggling content:", error);
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

  const sections = [
    { id: "navigation", name: "Navigation", icon: "🏠" },
    { id: "hero", name: "Hero Section", icon: "🌟" },
    { id: "news", name: "News Section", icon: "📰" },
    { id: "programs", name: "Programs Section", icon: "📚" },
    { id: "universities", name: "Universities Section", icon: "🎓" },
    { id: "programs-page", name: "Programs Page", icon: "📋" },
    { id: "header", name: "Programs Header", icon: "📝" },
    { id: "empty", name: "Empty State", icon: "📭" },
    { id: "auth", name: "Authentication", icon: "🔐" },
    { id: "modal", name: "Program Modal", icon: "💬" },
  ];

  const SECTION_DESCRIPTIONS: Record<string, string> = {
    navigation: "Site-wide navigation labels and actions.",
    hero: "Main hero headline, subtext, and call to action.",
    news: "News section titles and summaries.",
    programs: "Homepage programs snippet texts.",
    universities: "Universities section copy and labels.",
    "programs-page": "Texts and labels used on the Programs page.",
    header: "Programs header titles, subtitles, and helpers.",
    empty: "Empty texts shown when there is no data.",
    auth: "Login/Signup helper texts and labels.",
    modal: "Program modal titles, descriptions, and buttons.",
  };

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">
            Хэрэглэгчийн мэдээллийг ачаалж байна...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Админ
              </h1>
              <p className="text-gray-500 text-sm">
                Хэсэг бүрийн текст контентийг засварлах
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-sm sm:text-base">
                Тавтай морил, {user.firstName}!
              </span>
              <button
                onClick={() => router.push("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
              >
                Вэб рүү буцах
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-5">
                Хэсгүүд
              </h2>
              <div className="space-y-3">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-3.5">
                      <span className="text-lg sm:text-xl">{section.icon}</span>
                      <span className="font-medium text-sm sm:text-base">
                        {section.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-5 sm:p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-3 sm:items-center sm:justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {sections.find((s) => s.id === activeSection)?.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {SECTION_DESCRIPTIONS[activeSection] ||
                      "Энэ хэсэгт ашиглагдах текстүүдийг засварлана."}
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

              <div className="space-y-6 sm:space-y-8">
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
                              onClick={() =>
                                toggleContentStatus(contentItem.id)
                              }
                              role="switch"
                              aria-checked={contentItem.isActive}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                contentItem.isActive
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                              title={
                                contentItem.isActive ? "Active" : "Inactive"
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
                                Хадгалах
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
                      Энэ хэсэгт контент олдсонгүй.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
