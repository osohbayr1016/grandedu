"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";
import AdminUniversitiesTable from "@/components/AdminUniversitiesTable";
import AdminProgramsTable from "@/components/AdminProgramsTable";
import AdminNewsTable from "@/components/AdminNewsTable";
import AdminFooterEditor from "@/components/AdminFooterEditor";
import AdminContactMessages from "@/components/AdminContactMessages";
import Modal from "@/components/Modal";
import { Entity, Program, University, News } from "@/types";

interface ContentItem {
  id: string;
  page: string;
  section: string;
  field: string;
  content: string;
  type: string;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State management
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [content, setContent] = useState<ContentItem[]>([]);
  const [entities, setEntities] = useState<{
    universities: Entity[];
    programs: Entity[];
    news: Entity[];
    users: Entity[];
  }>({
    universities: [],
    programs: [],
    news: [],
    users: [],
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPrograms: 0,
    totalNews: 0,
    totalUniversities: 0,
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState<
    University | Program | News | null
  >(null);
  const [modalType, setModalType] = useState<string>("");

  // Sidebar navigation items
  const sidebarItems = [
    { id: "dashboard", name: "Хянах самбар", icon: "📊" },
    { id: "universities", name: "Их сургуулиуд", icon: "🎓" },
    { id: "programs", name: "Хөтөлбөрүүд", icon: "📚" },
    { id: "news", name: "Мэдээ", icon: "📰" },
    { id: "footer", name: "Footer", icon: "🔗" },
    { id: "messages", name: "Холбоо барих", icon: "💬" },
    { id: "users", name: "Хэрэглэгчид", icon: "👥" },
  ];

  // Check admin access
  useEffect(() => {
    if (authLoading) return;

    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!user?.role || user.role !== "admin") {
      if (!storedToken || !storedUser) {
        router.replace("/");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "admin") {
        router.replace("/");
        return;
      }
    }

    loadData();
  }, [user, authLoading, router]);

  const loadData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const [universitiesRes, programsRes, newsRes, usersRes, statsRes] =
        await Promise.all([
          authenticatedFetch(`${getApiBaseUrl()}/api/universities`, {}, token!),
          authenticatedFetch(`${getApiBaseUrl()}/api/programs`, {}, token!),
          authenticatedFetch(`${getApiBaseUrl()}/api/news`, {}, token!),
          authenticatedFetch(`${getApiBaseUrl()}/api/auth/users`, {}, token!),
          authenticatedFetch(`${getApiBaseUrl()}/api/auth/stats`, {}, token!),
        ]);

      if (universitiesRes.ok) {
        const universities = await universitiesRes.json();
        setEntities((prev) => ({ ...prev, universities }));
      }

      if (programsRes.ok) {
        const programs = await programsRes.json();
        setEntities((prev) => ({ ...prev, programs }));
      }

      if (newsRes.ok) {
        const news = await newsRes.json();
        setEntities((prev) => ({ ...prev, news }));
      }

      if (usersRes.ok) {
        const users = await usersRes.json();
        setEntities((prev) => ({ ...prev, users }));
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Entity handlers
  const handleEdit = (type: string, entity: University | Program | News) => {
    setEditingEntity(entity);
    setModalType(type);
    setShowModal(true);
  };

  const handleToggleStatus = async (
    type: string,
    entity: University | Program | News
  ) => {
    const token = localStorage.getItem("token");
    try {
      // Use the correct toggle endpoint
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/${type}/${entity.id}/toggle`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
        token!
      );

      if (response.ok) {
        const updatedEntity = await response.json();
        setEntities((prev) => ({
          ...prev,
          [type]: prev[type as keyof typeof prev].map((item: Entity) =>
            item.id === entity.id
              ? { ...item, isActive: updatedEntity.isActive }
              : item
          ),
        }));

        // Show success message
        console.log(`${type} status updated successfully`);
      } else {
        const errorData = await response.json();
        console.error(`Error toggling ${type}:`, errorData.message);
      }
    } catch (error) {
      console.error(`Error toggling status for ${type}:`, error);
    }
  };

  const handleAdd = (type: string) => {
    setEditingEntity(null);
    setModalType(type);
    setShowModal(true);
  };

  const handleModalSave = async (formData: Partial<Entity>) => {
    if (!modalType) return;

    const token = localStorage.getItem("token");

    try {
      if (editingEntity) {
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/${modalType}/${editingEntity.id}`,
          {
            method: "PUT",
            body: JSON.stringify(formData),
          },
          token!
        );

        if (response.ok) {
          const updatedEntity = await response.json();
          setEntities((prev) => ({
            ...prev,
            [modalType]: prev[modalType as keyof typeof prev].map(
              (item: Entity) =>
                item.id === editingEntity.id
                  ? { ...item, ...updatedEntity }
                  : item
            ),
          }));
        }
      } else {
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/${modalType}`,
          {
            method: "POST",
            body: JSON.stringify(formData),
          },
          token!
        );

        if (response.ok) {
          const newEntity = await response.json();
          setEntities((prev) => ({
            ...prev,
            [modalType]: [...prev[modalType as keyof typeof prev], newEntity],
          }));
        }
      }

      setShowModal(false);
      setEditingEntity(null);
      setModalType("");
    } catch (error) {
      console.error(`Error saving ${modalType}:`, error);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  if (loading) {
    return <LoadingSpinner message="Админ самбарыг ачаалж байна" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">
            Админ удирдлага
          </h1>
          <p className="text-sm text-gray-600 mt-1">Админ: {user.firstName}</p>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-900">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-2 text-xs text-red-600 hover:text-red-800"
          >
            Гарах
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {sidebarItems.find((item) => item.id === activeSection)?.name ||
                "Хянах самбар"}
            </h2>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Сайт руу буцах
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {activeSection === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats Cards */}
              <div className="bg-blue-500 text-white rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-blue-100 text-sm">Нийт хэрэглэгч</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <div className="text-3xl opacity-80">👥</div>
                </div>
              </div>

              <div className="bg-green-500 text-white rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-green-100 text-sm">Нийт хөтөлбөр</p>
                    <p className="text-2xl font-bold">{stats.totalPrograms}</p>
                  </div>
                  <div className="text-3xl opacity-80">📚</div>
                </div>
              </div>

              <div className="bg-purple-500 text-white rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-purple-100 text-sm">Нийт их сургууль</p>
                    <p className="text-2xl font-bold">
                      {stats.totalUniversities}
                    </p>
                  </div>
                  <div className="text-3xl opacity-80">🎓</div>
                </div>
              </div>

              <div className="bg-orange-500 text-white rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-orange-100 text-sm">Нийт мэдээ</p>
                    <p className="text-2xl font-bold">{stats.totalNews}</p>
                  </div>
                  <div className="text-3xl opacity-80">📰</div>
                </div>
              </div>

              {/* Quick Action Cards */}
              <div className="md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <button
                  onClick={() => setActiveSection("universities")}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎓</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Их сургуулиуд</p>
                      <p className="text-sm text-gray-500">Удирдах</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveSection("programs")}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📚</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Хөтөлбөрүүд</p>
                      <p className="text-sm text-gray-500">Удирдах</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveSection("news")}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📰</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Мэдээ</p>
                      <p className="text-sm text-gray-500">Удирдах</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveSection("footer")}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🔗</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Footer</p>
                      <p className="text-sm text-gray-500">Засварлах</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveSection("messages")}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💬</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Холбоо барих</p>
                      <p className="text-sm text-gray-500">Мэдээлэл</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveSection("users")}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">👥</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Хэрэглэгчид</p>
                      <p className="text-sm text-gray-500">Удирдах</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeSection === "universities" && (
            <AdminUniversitiesTable
              universities={entities.universities as University[]}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onEdit={(university) => handleEdit("universities", university)}
              onToggleStatus={(university) =>
                handleToggleStatus("universities", university)
              }
              onAdd={() => handleAdd("universities")}
            />
          )}

          {activeSection === "programs" && (
            <AdminProgramsTable
              programs={entities.programs as Program[]}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onEdit={(program) => handleEdit("programs", program)}
              onToggleStatus={(program) =>
                handleToggleStatus("programs", program)
              }
              onAdd={() => handleAdd("programs")}
            />
          )}

          {activeSection === "news" && (
            <AdminNewsTable
              news={entities.news as News[]}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onEdit={(newsItem) => handleEdit("news", newsItem)}
              onToggleStatus={(newsItem) =>
                handleToggleStatus("news", newsItem)
              }
              onAdd={() => handleAdd("news")}
            />
          )}

          {activeSection === "footer" && (
            <AdminFooterEditor onClose={() => setActiveSection("dashboard")} />
          )}

          {activeSection === "messages" && (
            <AdminContactMessages
              onClose={() => setActiveSection("dashboard")}
            />
          )}

          {activeSection === "users" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Хэрэглэгчид
                </h3>
                <p className="text-gray-600">
                  Хэрэглэгчийн удирдлага түр хугацаанд боломжгүй байна.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Энэ хэсгийг дараа хөгжүүлэх болно.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generic Entity Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          editingEntity
            ? `${
                modalType === "universities"
                  ? "Их сургууль"
                  : modalType === "programs"
                  ? "Хөтөлбөр"
                  : modalType === "news"
                  ? "Мэдээ"
                  : "Элемент"
              } засах`
            : `Шинэ ${
                modalType === "universities"
                  ? "их сургууль"
                  : modalType === "programs"
                  ? "хөтөлбөр"
                  : modalType === "news"
                  ? "мэдээ"
                  : "элемент"
              } нэмэх`
        }
        size="lg"
      >
        <EntityEditForm
          entity={editingEntity}
          onSave={handleModalSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}

// Generic Entity Edit Form Component
function EntityEditForm({
  entity,
  onSave,
  onCancel,
}: {
  entity: University | Program | News | null;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Record<string, unknown>>(
    (entity as unknown as Record<string, unknown>) || {}
  );

  useEffect(() => {
    if (entity) {
      setFormData(entity as unknown as Record<string, unknown>);
    } else {
      setFormData({});
    }
  }, [entity]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Мэдээлэл засах
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Энэ хэсэг түр хугацаанд хялбаршуулсан байна. Дэлгэрэнгүй засварлах
          боломжийг дараа нэмнэ.
        </p>
        <div className="bg-gray-50 p-4 rounded-md">
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
        >
          Цуцлах
        </button>
        <button
          onClick={() => onSave(formData)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Хадгалах
        </button>
      </div>
    </div>
  );
}
