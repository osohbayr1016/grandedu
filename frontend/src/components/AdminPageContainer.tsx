"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopBar from "@/components/AdminTopBar";
import AdminMainContent from "@/components/AdminMainContent";
import AdminDataManager from "@/components/AdminDataManager";

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
  adminNote?: string;
}

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  imageUrl: string;
  googleFormLink: string;
  isActive: boolean;
  isHighlighted?: boolean;
  adminNote?: string;
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

interface User {
  id: string;
  userCode: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isHighlighted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPageContainer() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State management
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [content, setContent] = useState<PageContent[]>([]);
  const [groupedContent, setGroupedContent] = useState<GroupedContent>({});
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPrograms: 0,
    totalNews: 0,
    totalUniversities: 0,
  });
  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Sections configuration
  const sections = [
    {
      id: "hero",
      name: "Hero хэсэг",
      description: "Үндсэн хуудасны контент",
      icon: "🏠",
    },
    {
      id: "about",
      name: "Бидний тухай",
      description: "Компанийн мэдээлэл",
      icon: "ℹ️",
    },
    {
      id: "programs",
      name: "Хөтөлбөрүүд",
      description: "Хөтөлбөрийн удирдлага",
      icon: "📚",
    },
    {
      id: "universities",
      name: "Их сургуулиуд",
      description: "Их сургуулийн удирдлага",
      icon: "🎓",
    },
    {
      id: "news",
      name: "Мэдээ",
      description: "Мэдээний удирдлага",
      icon: "📰",
    },
    {
      id: "users",
      name: "Хэрэглэгчид",
      description: "Хэрэглэгчийн удирдлага",
      icon: "👥",
    },
    {
      id: "footer",
      name: "Footer",
      description: "Хөл хэсгийн контент",
      icon: "📞",
    },
    {
      id: "university-sections",
      name: "Их сургуулийн хэсгүүд",
      description: "Хэсгүүдийн контент",
      icon: "📋",
    },
  ];

  // Initialize data
  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
  }, [user, authLoading, router]);

  const handleDataLoaded = (data: {
    content: PageContent[];
    groupedContent: GroupedContent;
    stats: DashboardStats;
    universities: University[];
    programs: Program[];
    news: News[];
    users: User[];
  }) => {
    setContent(data.content);
    setGroupedContent(data.groupedContent);
    setStats(data.stats);
    setUniversities(data.universities);
    setPrograms(data.programs);
    setNews(data.news);
    setUsers(data.users);
  };

  const handleContentChange = async (
    section: string,
    field: string,
    value: string
  ) => {
    const contentItem = content.find(
      (item) => item.section === section && item.field === field
    );

    if (contentItem) {
      try {
        const response = await fetch(`/api/content/${contentItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: value }),
        });

        if (response.ok) {
          const updatedContent = content.map((item) =>
            item.id === contentItem.id ? { ...item, content: value } : item
          );
          setContent(updatedContent);
          setGroupedContent((prev) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
          }));
        }
      } catch (error) {
        console.error("Error updating content:", error);
      }
    }
  };

  const handleSaveContent = async () => {
    // Content is saved automatically on change
  };

  // Loading and auth checks
  if (loading) {
    return <LoadingSpinner message="Админ самбарыг ачаалж байна" />;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AdminDataManager
        onDataLoaded={handleDataLoaded}
        onLoadingChange={setLoading}
      />

      <AdminTopBar />

      <div className="flex max-w-7xl mx-auto">
        <AdminSidebar currentPage="dashboard" />

        <AdminMainContent
          activeSection={activeSection}
          onActiveSectionChange={setActiveSection}
          sections={sections}
          groupedContent={groupedContent}
          stats={stats}
          universities={universities}
          programs={programs}
          news={news}
          users={users}
          onContentChange={handleContentChange}
          onSaveContent={handleSaveContent}
        />
      </div>
    </div>
  );
}
