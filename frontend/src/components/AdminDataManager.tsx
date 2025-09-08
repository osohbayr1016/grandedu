"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getContentUrl,
  getAdminProgramsUrl,
  getAdminNewsUrl,
  getAdminUniversitiesUrl,
  getUsersUrl,
  getStatsUrl,
  authenticatedFetch,
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

interface AdminDataManagerProps {
  onDataLoaded: (data: {
    content: PageContent[];
    groupedContent: GroupedContent;
    stats: DashboardStats;
    universities: University[];
    programs: Program[];
    news: News[];
    users: User[];
  }) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function AdminDataManager({
  onDataLoaded,
  onLoadingChange,
}: AdminDataManagerProps) {
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

  const fetchStats = useCallback(async () => {
    try {
      const response = await authenticatedFetch(getStatsUrl());
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchPrograms = useCallback(async () => {
    try {
      const response = await authenticatedFetch(getAdminProgramsUrl());
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      const response = await authenticatedFetch(getAdminNewsUrl());
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }, []);

  const fetchUniversities = useCallback(async () => {
    try {
      const response = await authenticatedFetch(getAdminUniversitiesUrl());
      if (response.ok) {
        const data = await response.json();
        setUniversities(data);
      }
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await authenticatedFetch(getUsersUrl());
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  const fetchContent = useCallback(async () => {
    try {
      const response = await authenticatedFetch(getContentUrl());
      if (response.ok) {
        const data = await response.json();
        setContent(data);
        groupContent(data);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  }, []);

  const groupContent = useCallback((contentData: PageContent[]) => {
    const grouped: GroupedContent = {};
    contentData.forEach((item) => {
      if (!grouped[item.section]) {
        grouped[item.section] = {};
      }
      grouped[item.section][item.field] = item.content;
    });
    setGroupedContent(grouped);
  }, []);

  const initializeData = useCallback(async () => {
    try {
      onLoadingChange(true);
      await Promise.all([
        fetchStats(),
        fetchPrograms(),
        fetchNews(),
        fetchUniversities(),
        fetchUsers(),
        fetchContent(),
      ]);
    } catch (error) {
      console.error("Error initializing admin data:", error);
    } finally {
      onLoadingChange(false);
    }
  }, [
    onLoadingChange,
    fetchStats,
    fetchPrograms,
    fetchNews,
    fetchUniversities,
    fetchUsers,
    fetchContent,
  ]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Notify parent when data is loaded
  useEffect(() => {
    if (
      content.length > 0 ||
      universities.length > 0 ||
      programs.length > 0 ||
      news.length > 0 ||
      users.length > 0
    ) {
      onDataLoaded({
        content,
        groupedContent,
        stats,
        universities,
        programs,
        news,
        users,
      });
    }
  }, [
    content,
    groupedContent,
    stats,
    universities,
    programs,
    news,
    users,
    onDataLoaded,
  ]);

  return null; // This component doesn't render anything
}
