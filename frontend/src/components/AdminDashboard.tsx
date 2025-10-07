"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";
import AdminUniversitiesTable from "@/components/AdminUniversitiesTable";
import AdminProgramsTable from "@/components/AdminProgramsTable";
import AdminNewsTable from "@/components/AdminNewsTable";
import AdminCoursesTable from "@/components/AdminCoursesTable";
import AdminFooterEditor from "@/components/AdminFooterEditor";
import AdminContactMessages from "@/components/AdminContactMessages";
import AdminUsersTable from "@/components/AdminUsersTable";
import CourseFormModal from "@/components/CourseFormModal";
import UniversityFormModal from "@/components/UniversityFormModal";
import ProgramFormModal from "@/components/ProgramFormModal";
import NewsFormModal from "@/components/NewsFormModal";
import { Entity, Program, University, News, Course } from "@/types";

// Removed legacy content editor types/modal

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State management
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [entities, setEntities] = useState<{
    universities: Entity[];
    programs: Entity[];
    news: Entity[];
    courses: Entity[];
    users: Entity[];
  }>({
    universities: [],
    programs: [],
    news: [],
    courses: [],
    users: [],
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPrograms: 0,
    totalNews: 0,
    totalUniversities: 0,
    totalCourses: 0,
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState<
    University | Program | News | Course | null
  >(null);
  const [courseModalLoading, setCourseModalLoading] = useState(false);
  const [universityModalLoading, setUniversityModalLoading] = useState(false);
  const [programModalLoading, setProgramModalLoading] = useState(false);
  const [newsModalLoading, setNewsModalLoading] = useState(false);

  // Sidebar navigation items
  const sidebarItems = [
    { id: "dashboard", name: "Хянах самбар", icon: "📊" },
    { id: "universities", name: "Их сургуулиуд", icon: "🎓" },
    { id: "programs", name: "Хөтөлбөрүүд", icon: "📚" },
    { id: "courses", name: "Сургалтууд", icon: "🎯" },
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
      const [
        universitiesRes,
        programsRes,
        newsRes,
        coursesRes,
        usersRes,
        statsRes,
      ] = await Promise.all([
        authenticatedFetch(`${getApiBaseUrl()}/api/universities`, {}, token!),
        authenticatedFetch(`${getApiBaseUrl()}/api/programs`, {}, token!),
        authenticatedFetch(`${getApiBaseUrl()}/api/news`, {}, token!),
        authenticatedFetch(`${getApiBaseUrl()}/api/courses`, {}, token!),
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

      if (coursesRes.ok) {
        const courses = await coursesRes.json();
        setEntities((prev) => ({ ...prev, courses }));
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
  const handleEdit = (
    type: string,
    entity: University | Program | News | Course
  ) => {
    setEditingEntity(entity);
    if (type === "courses") {
      setShowCourseModal(true);
    } else if (type === "universities") {
      setShowUniversityModal(true);
    } else if (type === "programs") {
      setShowProgramModal(true);
    } else if (type === "news") {
      setShowNewsModal(true);
    }
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
    if (type === "courses") {
      setShowCourseModal(true);
    } else if (type === "universities") {
      setShowUniversityModal(true);
    } else if (type === "programs") {
      setShowProgramModal(true);
    } else if (type === "news") {
      setShowNewsModal(true);
    }
  };

  // Removed legacy generic modal save handler

  // Course modal handlers
  const handleCourseSave = async (courseData: Partial<Course>) => {
    setCourseModalLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (editingEntity) {
        // Update existing course
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/courses/${editingEntity.id}`,
          {
            method: "PUT",
            body: JSON.stringify(courseData),
          },
          token!
        );

        if (response.ok) {
          const updatedCourse = await response.json();
          setEntities((prev) => ({
            ...prev,
            courses: prev.courses.map((course: Entity) =>
              course.id === editingEntity.id
                ? { ...course, ...updatedCourse }
                : course
            ),
          }));
          setShowCourseModal(false);
          setEditingEntity(null);
          alert("Сургалтыг амжилттай шинэчлэлээ!");
        }
      } else {
        // Create new course
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/courses`,
          {
            method: "POST",
            body: JSON.stringify(courseData),
          },
          token!
        );

        if (response.ok) {
          const newCourse = await response.json();
          setEntities((prev) => ({
            ...prev,
            courses: [...prev.courses, newCourse],
          }));
          setStats((prev) => ({
            ...prev,
            totalCourses: prev.totalCourses + 1,
          }));
          setShowCourseModal(false);
          setEditingEntity(null);
          alert("Сургалтыг амжилттай нэмлээ!");
        }
      }
    } catch (error) {
      console.error("Error saving course:", error);
      alert(
        "Алдаа гарлаа: " +
          (error instanceof Error ? error.message : "Тодорхойгүй алдаа")
      );
    } finally {
      setCourseModalLoading(false);
    }
  };

  // University modal handlers
  const handleUniversitySave = async (universityData: Partial<University>) => {
    setUniversityModalLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (editingEntity) {
        // Update existing university
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/universities/${editingEntity.id}`,
          {
            method: "PUT",
            body: JSON.stringify(universityData),
          },
          token!
        );

        if (response.ok) {
          const updatedUniversity = await response.json();
          setEntities((prev) => ({
            ...prev,
            universities: prev.universities.map((university: Entity) =>
              university.id === editingEntity.id
                ? { ...university, ...updatedUniversity }
                : university
            ),
          }));
          setShowUniversityModal(false);
          setEditingEntity(null);
          alert("Их сургуулийг амжилттай шинэчлэлээ!");
        }
      } else {
        // Create new university
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/universities`,
          {
            method: "POST",
            body: JSON.stringify(universityData),
          },
          token!
        );

        if (response.ok) {
          const newUniversity = await response.json();
          setEntities((prev) => ({
            ...prev,
            universities: [...prev.universities, newUniversity],
          }));
          setStats((prev) => ({
            ...prev,
            totalUniversities: prev.totalUniversities + 1,
          }));
          setShowUniversityModal(false);
          setEditingEntity(null);
          alert("Их сургуулийг амжилттай нэмлээ!");
        }
      }
    } catch (error) {
      console.error("Error saving university:", error);
      alert(
        "Алдаа гарлаа: " +
          (error instanceof Error ? error.message : "Тодорхойгүй алдаа")
      );
    } finally {
      setUniversityModalLoading(false);
    }
  };

  // Program modal handlers
  const handleProgramSave = async (programData: Partial<Program>) => {
    setProgramModalLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (editingEntity) {
        // Update existing program
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/programs/${editingEntity.id}`,
          {
            method: "PUT",
            body: JSON.stringify(programData),
          },
          token!
        );

        if (response.ok) {
          const updatedProgram = await response.json();
          setEntities((prev) => ({
            ...prev,
            programs: prev.programs.map((program: Entity) =>
              program.id === editingEntity.id
                ? { ...program, ...updatedProgram }
                : program
            ),
          }));
          setShowProgramModal(false);
          setEditingEntity(null);
          alert("Хөтөлбөрийг амжилттай шинэчлэлээ!");
        }
      } else {
        // Create new program
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/programs`,
          {
            method: "POST",
            body: JSON.stringify(programData),
          },
          token!
        );

        if (response.ok) {
          const newProgram = await response.json();
          setEntities((prev) => ({
            ...prev,
            programs: [...prev.programs, newProgram],
          }));
          setStats((prev) => ({
            ...prev,
            totalPrograms: prev.totalPrograms + 1,
          }));
          setShowProgramModal(false);
          setEditingEntity(null);
          alert("Хөтөлбөрийг амжилттай нэмлээ!");
        }
      }
    } catch (error) {
      console.error("Error saving program:", error);
      alert(
        "Алдаа гарлаа: " +
          (error instanceof Error ? error.message : "Тодорхойгүй алдаа")
      );
    } finally {
      setProgramModalLoading(false);
    }
  };

  // News modal handlers
  const handleNewsSave = async (newsData: Partial<News>) => {
    setNewsModalLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (editingEntity) {
        // Update existing news
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/news/${editingEntity.id}`,
          {
            method: "PUT",
            body: JSON.stringify(newsData),
          },
          token!
        );

        if (response.ok) {
          const updatedNews = await response.json();
          setEntities((prev) => ({
            ...prev,
            news: prev.news.map((newsItem: Entity) =>
              newsItem.id === editingEntity.id
                ? { ...newsItem, ...updatedNews }
                : newsItem
            ),
          }));
          setShowNewsModal(false);
          setEditingEntity(null);
          alert("Мэдээг амжилттай шинэчлэлээ!");
        }
      } else {
        // Create new news
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/news`,
          {
            method: "POST",
            body: JSON.stringify(newsData),
          },
          token!
        );

        if (response.ok) {
          const newNews = await response.json();
          setEntities((prev) => ({
            ...prev,
            news: [...prev.news, newNews],
          }));
          setStats((prev) => ({ ...prev, totalNews: prev.totalNews + 1 }));
          setShowNewsModal(false);
          setEditingEntity(null);
          alert("Мэдээг амжилттай нэмлээ!");
        }
      }
    } catch (error) {
      console.error("Error saving news:", error);
      alert(
        "Алдаа гарлаа: " +
          (error instanceof Error ? error.message : "Тодорхойгүй алдаа")
      );
    } finally {
      setNewsModalLoading(false);
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

              <div className="bg-indigo-500 text-white rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-indigo-100 text-sm">Нийт сургалт</p>
                    <p className="text-2xl font-bold">{stats.totalCourses}</p>
                  </div>
                  <div className="text-3xl opacity-80">🎯</div>
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
                  onClick={() => setActiveSection("courses")}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Сургалтууд</p>
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

          {activeSection === "courses" && (
            <AdminCoursesTable
              courses={entities.courses as Course[]}
              onUpdate={loadData}
              onEdit={(course) => handleEdit("courses", course)}
              onAdd={() => handleAdd("courses")}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
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
            <AdminUsersTable
              users={entities.users as any[]}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onUpdate={loadData}
            />
          )}
        </div>
      </div>

      {/* Course Form Modal */}
      <CourseFormModal
        isOpen={showCourseModal}
        onClose={() => {
          setShowCourseModal(false);
          setEditingEntity(null);
        }}
        course={editingEntity as Course}
        onSave={handleCourseSave}
        loading={courseModalLoading}
      />

      {/* University Form Modal */}
      <UniversityFormModal
        isOpen={showUniversityModal}
        onClose={() => {
          setShowUniversityModal(false);
          setEditingEntity(null);
        }}
        university={editingEntity as University}
        onSave={handleUniversitySave}
        loading={universityModalLoading}
      />

      {/* Program Form Modal */}
      <ProgramFormModal
        isOpen={showProgramModal}
        onClose={() => {
          setShowProgramModal(false);
          setEditingEntity(null);
        }}
        program={editingEntity as Program}
        onSave={handleProgramSave}
        loading={programModalLoading}
      />

      {/* News Form Modal */}
      <NewsFormModal
        isOpen={showNewsModal}
        onClose={() => {
          setShowNewsModal(false);
          setEditingEntity(null);
        }}
        news={editingEntity as News}
        onSave={handleNewsSave}
        loading={newsModalLoading}
      />
    </div>
  );
}
