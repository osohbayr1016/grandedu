"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import PageStructuredData from "@/components/PageStructuredData";
import {
  getHomeContentUrl,
  getNewsUrl,
  getProgramsUrl,
  getUniversitiesUrl,
} from "@/utils/api";
import { createTimeoutSignal } from "@/utils/requestUtils";
import { useAuth } from "@/contexts/AuthContext";

interface PageContent {
  [section: string]: {
    [field: string]: string;
  };
}

interface News {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  isActive: boolean;
}

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price?: string;
  location?: string;
  university?: string;
  requirements?: string;
  imageUrl?: string;
  isHighlighted: boolean;
  isActive: boolean;
}

interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
}

export default function Home() {
  const [pageContent, setPageContent] = useState<PageContent>({});
  const [contentLoading, setContentLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [news, setNews] = useState<News[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { user, showAuth, setShowAuth, isLogin, setIsLogin } = useAuth();

  useEffect(() => {
    fetchPageContent();
    fetchRealData();
  }, []);

  // Scroll state kept for floating menu animation, nav now global
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchPageContent = async () => {
    try {
      const response = await fetch(getHomeContentUrl(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: createTimeoutSignal(10000),
      });

      if (response.ok) {
        const data = await response.json();
        setPageContent(data);
      } else {
        console.error(
          "Failed to fetch page content:",
          response.status,
          response.statusText
        );
        // Set default content if backend is not available
        setPageContent({});
      }
    } catch (error) {
      console.error("Error fetching page content:", error);
      // Set default content if backend is not available
      setPageContent({});
    } finally {
      setContentLoading(false);
    }
  };

  const fetchRealData = async () => {
    try {
      // Fetch news, programs, and universities in parallel
      const [newsResponse, programsResponse, universitiesResponse] =
        await Promise.all([
          fetch(getNewsUrl()),
          fetch(getProgramsUrl()),
          fetch(getUniversitiesUrl()),
        ]);

      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        setNews(newsData);
      }

      if (programsResponse.ok) {
        const programsData = await programsResponse.json();
        setPrograms(programsData);
      }

      if (universitiesResponse.ok) {
        const universitiesData = await universitiesResponse.json();
        setUniversities(universitiesData);
      }
    } catch (error) {
      console.error("Error fetching real data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // Helper function to get content without default fallbacks
  const getContent = (
    section: string,
    field: string,
    fallback: string = ""
  ) => {
    return pageContent[section]?.[field] ?? fallback;
  };

  if (contentLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageStructuredData
        type="webpage"
        data={{
          title: "GrandEdu - Хятадад зуучлах баталгаат хамт олон",
          description:
            "Монголын оюутан залуусыг Хятад улсад суралцахад мэргэжлийн зуучлал, их сургуулиудын мэдээлэл, хөтөлбөрүүдийн зөвлөгөө өгдөг найдвартай платформ.",
          url: "https://grandedu.mn",
          breadcrumbs: [{ name: "Нүүр", url: "https://grandedu.mn" }],
        }}
      />
      {/* {process.env.NODE_ENV === "development" && <BackendTest />} */}
      {/* Navigation moved to global layout */}

      {/* Floating Menu Button (when not scrolled) */}
      {!isScrolled && (
        <div className="fixed top-4 right-4 z-40 animate-fade-in-up animate-delay-1000">
          <button
            onClick={() => setShowAuth(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full border border-white border-opacity-30 transition-all duration-300 backdrop-blur-sm transform hover:scale-110"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative text-white h-screen min-h-[500px] max-h-[800px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${getContent(
              "hero",
              "backgroundImage",
              "https://images.unsplash.com/photo-1523050854058-8df90110c9e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            )}')`,
          }}
        ></div>
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/60"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in-up animate-delay-200">
              {getContent(
                "hero",
                "title",
                "Хятадад зуучлах баталгаат хамт олон GrandEdu"
              )}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 px-4 animate-fade-in-up animate-delay-500">
              {getContent(
                "hero",
                "subtitle",
                "Бидэнтэй холбогдоод хятадад амжилттай суралцаарай"
              )}
            </p>
            {!user && (
              <button
                onClick={() => {
                  setIsLogin(false); // Set to signup mode
                  setShowAuth(true);
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-fade-in-up animate-delay-700"
              >
                {getContent("hero", "ctaButton", "Эхлэх")}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Header Design */}
      <div className="relative bg-white shadow-lg overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute top-1/2 right-0 w-48 h-48 bg-purple-600 rounded-full translate-x-24 -translate-y-24"></div>
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-indigo-600 rounded-full translate-y-16"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              GrandEdu
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Хятадад зуучлах баталгаат хамт олон
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Бидэнтэй холбогдоод хятадад амжилттай суралцаарай
            </p>
          </div>
        </div>
      </div>

      {/* Latest News Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 space-y-4 sm:space-y-0 animate-fade-in-up">
              <div className="w-full sm:w-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                  {getContent("news", "title", "Сүүлийн мэдээ")}
                </h2>
                <div className="w-full h-0.5 bg-gray-300 mx-auto mb-6"></div>
                <p className="text-gray-600 text-sm sm:text-base">
                  {getContent(
                    "news",
                    "description",
                    "Хятадын их сургуулиудад элсэх боломж болон тэтгэлгийн мэдээллийг аваарай"
                  )}
                </p>
              </div>
              <Link
                href="/news"
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
              >
                {getContent("news", "viewAllButton", "Бүх мэдээг харах →")}
              </Link>
            </div>

            {/* News Cards */}
            {news.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {news.slice(0, 3).map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-lg p-4 sm:p-6 animate-fade-in-up animate-delay-300"
                    style={{ animationDelay: `${(index + 1) * 200}ms` }}
                  >
                    <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                        МЭДЭЭ
                      </span>
                      <span className="ml-2 sm:ml-3">
                        {new Date(item.publishDate).toLocaleDateString(
                          "mn-MN",
                          {
                            year: "numeric",
                            month: "long",
                          }
                        )}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {item.content.length > 100
                        ? `${item.content.substring(0, 100)}...`
                        : item.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">Хоосон байна</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                {getContent("programs", "title", "Манай хөтөлбөрүүд")}
              </h2>
              <div className="w-full h-0.5 bg-gray-300 mx-auto mb-6"></div>
              <p className="text-gray-600 text-base sm:text-lg px-4">
                {getContent(
                  "programs",
                  "description",
                  "Хятадын их сургуулиудад суралцах боломжийг сонгоно уу"
                )}
              </p>
            </div>

            {programs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {programs.slice(0, 4).map((program, index) => (
                  <div
                    key={program.id}
                    className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up animate-delay-200"
                    style={{ animationDelay: `${(index + 1) * 200}ms` }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                      {program.description}
                    </p>
                    <div className="text-sm text-gray-500 mb-3">
                      <p>Хугацаа: {program.duration}</p>
                      <p>Түвшин: {program.level}</p>
                      {program.price && <p>Үнэ: {program.price}</p>}
                    </div>
                    <Link
                      href="/programs"
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                    >
                      {getContent(
                        "programs",
                        "viewMoreButton",
                        "Дэлгэрэнгүй →"
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">Хоосон байна</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                {getContent(
                  "universities",
                  "title",
                  "Хамтран ажилладаг их сургуулиуд"
                )}
              </h2>
              <div className="w-full h-0.5 bg-gray-300 mx-auto mb-6"></div>
              <p className="text-gray-600 text-base sm:text-lg px-4">
                {getContent(
                  "universities",
                  "description",
                  "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг"
                )}
              </p>
            </div>

            {universities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {universities.slice(0, 3).map((university, index) => (
                  <div
                    key={university.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up animate-delay-300"
                    style={{ animationDelay: `${(index + 1) * 200}ms` }}
                  >
                    <div className="h-32 sm:h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <div className="text-white text-center px-2">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 sm:w-8 sm:h-8"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                          </svg>
                        </div>
                        <h3 className="text-sm sm:text-lg font-bold">
                          {university.name}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">
                        {university.location}
                      </p>
                      {university.description && (
                        <p className="text-gray-600 mb-3 text-sm">
                          {university.description.length > 100
                            ? `${university.description.substring(0, 100)}...`
                            : university.description}
                        </p>
                      )}
                      <Link
                        href="/universities"
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                      >
                        {getContent(
                          "universities",
                          "viewMoreButton",
                          "Дэлгэрэнгүй →"
                        )}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">Хоосон байна</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Authentication Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-50 animate-fade-in overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4 py-8">
            <div className="relative animate-scale-in">
              <button
                onClick={() => setShowAuth(false)}
                className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
              >
                ×
              </button>
              {isLogin ? (
                <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
              ) : (
                <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
