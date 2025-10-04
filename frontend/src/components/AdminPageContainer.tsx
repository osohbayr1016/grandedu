"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";
import AdminDashboard from "@/components/AdminDashboard";
import AdminPageEditor from "@/components/AdminPageEditor";
import AdminUniversitiesTable from "@/components/AdminUniversitiesTable";
import AdminProgramsTable from "@/components/AdminProgramsTable";
import AdminNewsTable from "@/components/AdminNewsTable";
import Modal from "@/components/Modal";

// Simplified interfaces for cleaner code
interface ContentItem {
  id: string;
  page: string;
  section: string;
  field: string;
  content: string;
  type: string;
}

import { Entity, Program, University, News } from "@/types";

// Simple Admin Dashboard - Unified interface for managing all website content
export default function AdminPageContainer() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Simple state management
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
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

  // Search state for improved tables
  const [searchQueries, setSearchQueries] = useState({
    universities: "",
    programs: "",
    news: "",
  });

  // Simple tab configuration
  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "pages", name: "Pages", icon: "📄" },
    { id: "universities", name: "Universities", icon: "🎓" },
    { id: "programs", name: "Programs", icon: "📚" },
    { id: "news", name: "News", icon: "📰" },
    { id: "users", name: "Users", icon: "👥" },
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
      // Load all content and entities in parallel
      const [contentRes, universitiesRes, programsRes, newsRes, usersRes] =
        await Promise.all([
          authenticatedFetch(`${getApiBaseUrl()}/api/content`, {}, token!),
          authenticatedFetch(`${getApiBaseUrl()}/api/universities`, {}, token!),
          authenticatedFetch(`${getApiBaseUrl()}/api/programs`, {}, token!),
          authenticatedFetch(`${getApiBaseUrl()}/api/news`, {}, token!),
          authenticatedFetch(`${getApiBaseUrl()}/api/users`, {}, token!),
        ]);

      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setContent(contentData);
      }

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
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Simple content update handler
  const updateContent = async (
    field: string,
    value: string,
    section: string,
    page: string
  ) => {
    const token = localStorage.getItem("token");
    const existingItem = content.find(
      (item) => item.field === field && item.section === section
    );

    try {
      if (existingItem) {
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/content/${existingItem.id}`,
          {
            method: "PUT",
            body: JSON.stringify({ content: value }),
          },
          token!
        );

        if (response.ok) {
          setContent((prev) =>
            prev.map((item) =>
              item.id === existingItem.id ? { ...item, content: value } : item
            )
          );
        }
      } else {
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/content`,
          {
            method: "POST",
            body: JSON.stringify({
              page,
              section,
              field,
              content: value,
              type: "text",
            }),
          },
          token!
        );

        if (response.ok) {
          const newItem = await response.json();
          setContent((prev) => [...prev, newItem]);
        }
      }
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  // Helper functions for improved tables
  const [showModal, setShowModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState<
    University | Program | News | null
  >(null);
  const [modalType, setModalType] = useState<string>("");

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
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/${type}/${entity.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ isActive: !entity.isActive }),
        },
        token!
      );

      if (response.ok) {
        setEntities((prev) => ({
          ...prev,
          [type]: prev[type as keyof typeof prev].map((item: Entity) =>
            item.id === entity.id ? { ...item, isActive: !item.isActive } : item
          ),
        }));
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
        // Update existing entity
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
        // Create new entity
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
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Админ Самбар
            </h1>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Сайт руу буцах
            </button>
          </div>
        </div>
      </div>

      {/* Simple Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <AdminDashboard entities={entities} />}
        {activeTab === "pages" && (
          <AdminPageEditor content={content} onUpdate={updateContent} />
        )}
        {activeTab === "universities" && (
          <AdminUniversitiesTable
            universities={entities.universities as University[]}
            searchQuery={searchQueries.universities}
            onSearchChange={(query) =>
              setSearchQueries((prev) => ({ ...prev, universities: query }))
            }
            onEdit={(university) => handleEdit("universities", university)}
            onToggleStatus={(university) =>
              handleToggleStatus("universities", university)
            }
            onAdd={() => handleAdd("universities")}
          />
        )}
        {activeTab === "programs" && (
          <AdminProgramsTable
            programs={entities.programs as Program[]}
            searchQuery={searchQueries.programs}
            onSearchChange={(query) =>
              setSearchQueries((prev) => ({ ...prev, programs: query }))
            }
            onEdit={(program) => handleEdit("programs", program)}
            onToggleStatus={(program) =>
              handleToggleStatus("programs", program)
            }
            onAdd={() => handleAdd("programs")}
          />
        )}
        {activeTab === "news" && (
          <AdminNewsTable
            news={entities.news as News[]}
            searchQuery={searchQueries.news}
            onSearchChange={(query) =>
              setSearchQueries((prev) => ({ ...prev, news: query }))
            }
            onEdit={(newsItem) => handleEdit("news", newsItem)}
            onToggleStatus={(newsItem) => handleToggleStatus("news", newsItem)}
            onAdd={() => handleAdd("news")}
          />
        )}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8">
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
    </div>
  );
}

// Generic Entity Edit Form Component - Simplified for production deployment
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
