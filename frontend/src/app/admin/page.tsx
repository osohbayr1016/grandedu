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

interface DashboardStats {
  totalUsers: number;
  totalPrograms: number;
  totalNews: number;
  totalUniversities: number;
}

interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  imageUrl: string;
  isActive: boolean;
}

interface News {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  imageUrl: string;
  isActive: boolean;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<PageContent[]>([]);
  const [groupedContent, setGroupedContent] = useState<GroupedContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("universities");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(
    null
  );
  const [universityForm, setUniversityForm] = useState({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
  });

  // Program form state
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programForm, setProgramForm] = useState({
    title: "",
    description: "",
    duration: "",
    level: "",
    imageUrl: "",
  });

  // News form state
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    author: "",
    publishDate: "",
    imageUrl: "",
  });

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPrograms: 0,
    totalNews: 0,
    totalUniversities: 0,
  });

  // Sample universities data - in real app this would come from your database
  const [universities, setUniversities] = useState<University[]>([
    {
      id: "1",
      name: "Сычуань их сургууль",
      location: "Чэнду, Сычуань",
      description: "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг",
      imageUrl: "https://example.com/sichuan.jpg",
      isActive: true,
    },
    {
      id: "2",
      name: "Хятадын Шинжлэх Ухаан, Технологийн Их Сургууль",
      location: "Хэфэй, Аньхой",
      description: "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг",
      imageUrl: "https://example.com/ustc.jpg",
      isActive: true,
    },
    {
      id: "3",
      name: "Шанхайн Жяо Тонгийн Их Сургууль",
      location: "Шанхай",
      description: "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг",
      imageUrl: "https://example.com/sjtu.jpg",
      isActive: true,
    },
  ]);

  // Sample programs data
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: "1",
      title: "Бакалаврын хөтөлбөр",
      description: "4 жилийн бакалаврын зэрэг",
      duration: "4 жил",
      level: "Бакалавр",
      imageUrl: "https://example.com/bachelor.jpg",
      isActive: true,
    },
    {
      id: "2",
      title: "Магистрын хөтөлбөр",
      description: "2 жилийн магистрын зэрэг",
      duration: "2 жил",
      level: "Магистр",
      imageUrl: "https://example.com/master.jpg",
      isActive: true,
    },
    {
      id: "3",
      title: "Докторын хөтөлбөр",
      description: "3-4 жилийн докторын зэрэг",
      duration: "3-4 жил",
      level: "Доктор",
      imageUrl: "https://example.com/phd.jpg",
      isActive: true,
    },
  ]);

  // Sample news data
  const [news, setNews] = useState<News[]>([
    {
      id: "1",
      title: "Шинэ хөтөлбөр эхэллээ",
      content: "Хятадын их сургуулиудтай хамтран ажиллах шинэ хөтөлбөр эхэллээ",
      author: "Admin",
      publishDate: "2024-08-11",
      imageUrl: "https://example.com/news1.jpg",
      isActive: true,
    },
    {
      id: "2",
      title: "Их сургуулийн түншлэл",
      content: "Шинэ их сургуулиудтай түншлэл байгууллаа",
      author: "Admin",
      publishDate: "2024-08-10",
      imageUrl: "https://example.com/news2.jpg",
      isActive: true,
    },
  ]);

  const handleAddUniversity = () => {
    setEditingUniversity(null);
    setUniversityForm({
      name: "",
      location: "",
      description: "",
      imageUrl: "",
    });
    setShowUniversityModal(true);
  };

  const handleEditUniversity = (university: University) => {
    setEditingUniversity(university);
    setUniversityForm({
      name: university.name,
      location: university.location,
      description: university.description,
      imageUrl: university.imageUrl,
    });
    setShowUniversityModal(true);
  };

  const handleSaveUniversity = () => {
    if (editingUniversity) {
      // Update existing university
      setUniversities((prev) =>
        prev.map((uni) =>
          uni.id === editingUniversity.id ? { ...uni, ...universityForm } : uni
        )
      );
    } else {
      // Add new university
      const newUniversity: University = {
        id: Date.now().toString(),
        ...universityForm,
        isActive: true,
      };
      setUniversities((prev) => [...prev, newUniversity]);
    }
    setShowUniversityModal(false);
    setEditingUniversity(null);
    setUniversityForm({
      name: "",
      location: "",
      description: "",
      imageUrl: "",
    });
  };

  const handleDeleteUniversity = (id: string) => {
    if (confirm("Энэ их сургуулийг устгахдаа итгэлтэй байна уу?")) {
      setUniversities((prev) => prev.filter((uni) => uni.id !== id));
    }
  };

  const handleToggleUniversityStatus = (id: string) => {
    setUniversities((prev) =>
      prev.map((uni) =>
        uni.id === id ? { ...uni, isActive: !uni.isActive } : uni
      )
    );
  };

  // Program handlers
  const handleAddProgram = () => {
    setEditingProgram(null);
    setProgramForm({
      title: "",
      description: "",
      duration: "",
      level: "",
      imageUrl: "",
    });
    setShowProgramModal(true);
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setProgramForm({
      title: program.title,
      description: program.description,
      duration: program.duration,
      level: program.level,
      imageUrl: program.imageUrl,
    });
    setShowProgramModal(true);
  };

  const handleSaveProgram = () => {
    if (editingProgram) {
      setPrograms((prev) =>
        prev.map((prog) =>
          prog.id === editingProgram.id ? { ...prog, ...programForm } : prog
        )
      );
    } else {
      const newProgram: Program = {
        id: Date.now().toString(),
        ...programForm,
        isActive: true,
      };
      setPrograms((prev) => [...prev, newProgram]);
    }
    setShowProgramModal(false);
    setEditingProgram(null);
    setProgramForm({
      title: "",
      description: "",
      duration: "",
      level: "",
      imageUrl: "",
    });
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((prog) => prog.id !== id));
  };

  const handleToggleProgramStatus = (id: string) => {
    setPrograms((prev) =>
      prev.map((prog) =>
        prog.id === id ? { ...prog, isActive: !prog.isActive } : prog
      )
    );
  };

  // News handlers
  const handleAddNews = () => {
    setEditingNews(null);
    setNewsForm({
      title: "",
      content: "",
      author: "",
      publishDate: new Date().toISOString().split("T")[0],
      imageUrl: "",
    });
    setShowNewsModal(true);
  };

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem);
    setNewsForm({
      title: newsItem.title,
      content: newsItem.content,
      author: newsItem.author,
      publishDate: newsItem.publishDate,
      imageUrl: newsItem.imageUrl,
    });
    setShowNewsModal(true);
  };

  const handleSaveNews = () => {
    if (editingNews) {
      setNews((prev) =>
        prev.map((item) =>
          item.id === editingNews.id ? { ...item, ...newsForm } : item
        )
      );
    } else {
      const newNews: News = {
        id: Date.now().toString(),
        ...newsForm,
        isActive: true,
      };
      setNews((prev) => [...prev, newNews]);
    }
    setShowNewsModal(false);
    setEditingNews(null);
    setNewsForm({
      title: "",
      content: "",
      author: "",
      publishDate: new Date().toISOString().split("T")[0],
      imageUrl: "",
    });
  };

  const handleDeleteNews = (id: string) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleNewsStatus = (id: string) => {
    setNews((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchContent();
    fetchStats();
  }, [
    user,
    authLoading,
    router,
    programs.length,
    news.length,
    universities.length,
  ]);

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
      console.error("Контент татахад алдаа гарлаа:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // In a real app, you would fetch these from your API
      setStats({
        totalUsers: 1, // admin user
        totalPrograms: programs.length,
        totalNews: news.length,
        totalUniversities: universities.length,
      });
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

  // Only show sections that actually exist in your GrandEdu website
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
      description: "Их сургуулийн жагсаалт, нэмэх, засах",
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
          {/* Enhanced Header Design */}
          <div className="relative bg-white shadow-lg overflow-hidden rounded-lg mb-8">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full -translate-x-32 -translate-y-32"></div>
              <div className="absolute top-1/2 right-0 w-48 h-48 bg-purple-600 rounded-full translate-x-24 -translate-y-24"></div>
              <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-indigo-600 rounded-full translate-y-16"></div>
            </div>

            <div className="p-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Админ самбар
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  {sections.find((s) => s.id === activeSection)?.name}
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                  {sections.find((s) => s.id === activeSection)?.description}
                </p>
              </div>
            </div>
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

          {/* Content Display */}
          {activeSection === "universities" ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-3 sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Их сургуулиуд - Хянах самбар
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Бүх их сургуулийн мэдээллийг нэг хэсэгт харах, засварлах
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Их сургууль хайх..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      🔎
                    </span>
                  </div>
                  <button
                    onClick={handleAddUniversity}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Шинэ сургууль нэмэх</span>
                  </button>
                </div>
              </div>

              {/* Universities Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Их сургууль
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Байршил
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Тайлбар
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Төлөв
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Үйлдэл
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {universities.map((university) => (
                      <tr key={university.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <svg
                                className="w-5 h-5 text-blue-600"
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
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {university.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {university.location}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {university.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleToggleUniversityStatus(university.id)
                            }
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                              university.isActive
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          >
                            {university.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUniversity(university)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Засах"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/universities/${university.id}`
                                )
                              }
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Дэлгэрэнгүй засах"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteUniversity(university.id)
                              }
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Устгах"
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeSection === "programs" ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-3 sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Хөтөлбөрүүд - Хянах самбар
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Бүх хөтөлбөрийн мэдээллийг нэг хэсэгт харах, засварлах
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Хөтөлбөр хайх..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      🔎
                    </span>
                  </div>
                  <button
                    onClick={handleAddProgram}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Шинэ хөтөлбөр нэмэх</span>
                  </button>
                </div>
              </div>

              {/* Programs Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Хөтөлбөр
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Тайлбар
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Үргэлжлэх хугацаа
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Түвшин
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Төлөв
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Үйлдэл
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {programs.map((program) => (
                      <tr key={program.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                              <svg
                                className="w-5 h-5 text-green-600"
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
                              <div className="text-sm font-medium text-gray-900">
                                {program.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {program.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {program.duration}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {program.level}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleToggleProgramStatus(program.id)
                            }
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              program.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {program.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditProgram(program)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Засах"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteProgram(program.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Устгах"
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeSection === "news" ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-3 sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Мэдээ - Хянах самбар
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Бүх мэдээний мэдээллийг нэг хэсэгт харах, засварлах
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Мэдээ хайх..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      🔎
                    </span>
                  </div>
                  <button
                    onClick={handleAddNews}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Шинэ мэдээ нэмэх</span>
                  </button>
                </div>
              </div>

              {/* News Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Мэдээ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Агуулга
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Зохиогч
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Огноо
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Төлөв
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Үйлдэл
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {news.map((newsItem) => (
                      <tr key={newsItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                              <svg
                                className="w-5 h-5 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {newsItem.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {newsItem.content}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {newsItem.author}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {newsItem.publishDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleNewsStatus(newsItem.id)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              newsItem.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {newsItem.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditNews(newsItem)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Засах"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteNews(newsItem.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Устгах"
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-3 sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {sections.find((s) => s.id === activeSection)?.name} -
                    Контент засвар
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
          )}
        </div>
      </div>

      {/* University Add/Edit Modal */}
      {showUniversityModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingUniversity
                    ? "Их сургууль засах"
                    : "Шинэ их сургууль нэмэх"}
                </h3>
                <button
                  onClick={() => setShowUniversityModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Их сургуулийн нэр
                  </label>
                  <input
                    type="text"
                    value={universityForm.name}
                    onChange={(e) =>
                      setUniversityForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Их сургуулийн нэр оруулна уу"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Байршил
                  </label>
                  <input
                    type="text"
                    value={universityForm.location}
                    onChange={(e) =>
                      setUniversityForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Хот, муж оруулна уу"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тайлбар
                  </label>
                  <textarea
                    value={universityForm.description}
                    onChange={(e) =>
                      setUniversityForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Их сургуулийн тайлбар оруулна уу"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Зургийн URL
                  </label>
                  <input
                    type="url"
                    value={universityForm.imageUrl}
                    onChange={(e) =>
                      setUniversityForm((prev) => ({
                        ...prev,
                        imageUrl: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUniversityModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleSaveUniversity}
                  disabled={!universityForm.name || !universityForm.location}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingUniversity ? "Хадгалах" : "Нэмэх"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Program Add/Edit Modal */}
      {showProgramModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingProgram ? "Хөтөлбөр засах" : "Шинэ хөтөлбөр нэмэх"}
                </h3>
                <button
                  onClick={() => setShowProgramModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Хөтөлбөрийн нэр
                  </label>
                  <input
                    type="text"
                    value={programForm.title}
                    onChange={(e) =>
                      setProgramForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Хөтөлбөрийн нэр оруулна уу"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тайлбар
                  </label>
                  <textarea
                    value={programForm.description}
                    onChange={(e) =>
                      setProgramForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Хөтөлбөрийн тайлбар оруулна уу"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Үргэлжлэх хугацаа
                  </label>
                  <input
                    type="text"
                    value={programForm.duration}
                    onChange={(e) =>
                      setProgramForm((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Жишээ: 4 жил"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Түвшин
                  </label>
                  <input
                    type="text"
                    value={programForm.level}
                    onChange={(e) =>
                      setProgramForm((prev) => ({
                        ...prev,
                        level: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Жишээ: Бакалавр"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Зургийн URL
                  </label>
                  <input
                    type="url"
                    value={programForm.imageUrl}
                    onChange={(e) =>
                      setProgramForm((prev) => ({
                        ...prev,
                        imageUrl: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleSaveProgram}
                  disabled={!programForm.title || !programForm.description}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProgram ? "Хадгалах" : "Нэмэх"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Add/Edit Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingNews ? "Мэдээ засах" : "Шинэ мэдээ нэмэх"}
                </h3>
                <button
                  onClick={() => setShowNewsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Мэдээний гарчиг
                  </label>
                  <input
                    type="text"
                    value={newsForm.title}
                    onChange={(e) =>
                      setNewsForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Мэдээний гарчиг оруулна уу"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Агуулга
                  </label>
                  <textarea
                    value={newsForm.content}
                    onChange={(e) =>
                      setNewsForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Мэдээний агуулга оруулна уу"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Зохиогч
                  </label>
                  <input
                    type="text"
                    value={newsForm.author}
                    onChange={(e) =>
                      setNewsForm((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Зохиогчийн нэр оруулна уу"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Огноо
                  </label>
                  <input
                    type="date"
                    value={newsForm.publishDate}
                    onChange={(e) =>
                      setNewsForm((prev) => ({
                        ...prev,
                        publishDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Зургийн URL
                  </label>
                  <input
                    type="url"
                    value={newsForm.imageUrl}
                    onChange={(e) =>
                      setNewsForm((prev) => ({
                        ...prev,
                        imageUrl: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewsModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleSaveNews}
                  disabled={!newsForm.title || !newsForm.content}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingNews ? "Хадгалах" : "Нэмэх"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
