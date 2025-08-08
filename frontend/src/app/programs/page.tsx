"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import {
  getProgramsUrl,
  getProgramsContentUrl,
  getNavigationContentUrl,
} from "@/utils/api";
import { defaultContent } from "@/utils/defaultContent";

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  location: string;
  university: string;
  requirements: string;
  imageUrl?: string;
}

interface PageContent {
  [section: string]: {
    [field: string]: string;
  };
}

export default function ProgramsPage() {
  const { user, logout } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageContent, setPageContent] = useState<PageContent>({});
  const [contentLoading, setContentLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetchPrograms();
    fetchPageContent();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100); // Show nav after 100px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(getProgramsUrl(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      } else {
        console.error(
          "Failed to fetch programs:",
          response.status,
          response.statusText
        );
        setError("Failed to fetch programs");
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      setError("Error fetching programs");
    } finally {
      setLoading(false);
    }
  };

  const fetchPageContent = async () => {
    try {
      // Fetch content for multiple pages
      const [programsResponse, navigationResponse] = await Promise.all([
        fetch(getProgramsContentUrl(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(10000),
        }),
        fetch(getNavigationContentUrl(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(10000),
        }),
      ]);

      let allContent = {};

      if (programsResponse.ok) {
        const programsData = await programsResponse.json();
        allContent = { ...allContent, ...programsData };
      } else {
        console.error(
          "Failed to fetch programs content:",
          programsResponse.status
        );
      }

      if (navigationResponse.ok) {
        const navigationData = await navigationResponse.json();
        allContent = { ...allContent, ...navigationData };
      } else {
        console.error(
          "Failed to fetch navigation content:",
          navigationResponse.status
        );
      }

      setPageContent(allContent);
    } catch (error) {
      console.error("Error fetching page content:", error);
      setPageContent({});
    } finally {
      setContentLoading(false);
    }
  };

  // Helper function to get content with fallback
  const getContent = (
    section: string,
    field: string,
    fallback: string = ""
  ) => {
    // If content is not loaded, use default content
    if (Object.keys(pageContent).length === 0) {
      const defaultSection = defaultContent[
        section as keyof typeof defaultContent
      ] as Record<string, string> | undefined;
      return defaultSection?.[field] || fallback;
    }
    return (
      pageContent[section]?.[field] ||
      (
        defaultContent[section as keyof typeof defaultContent] as
          | Record<string, string>
          | undefined
      )?.[field] ||
      fallback
    );
  };

  const openModal = (program: Program) => {
    setSelectedProgram(program);
    setShowModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProgram(null);
    // Restore body scroll
    document.body.style.overflow = "unset";
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

  if (loading || contentLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">
            Хөтөлбөрүүдийг ачаалж байна...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 text-sm sm:text-base">
            Алдаа гарлаа: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg transform translate-y-0"
            : "bg-transparent shadow-none transform -translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1
                className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? "text-black" : "text-white"
                }`}
              >
                {getContent("navigation", "logo", "GrandEdu")}
              </h1>
              <Link
                href="/"
                className={`font-medium text-sm sm:text-base transition-colors duration-300 ${
                  isScrolled
                    ? "text-gray-600 hover:text-blue-600"
                    : "text-white hover:text-blue-200"
                }`}
              >
                {getContent("navigation", "homeLink", "Нүүр")}
              </Link>
              <Link
                href="/programs"
                className={`font-medium text-sm sm:text-base transition-colors duration-300 ${
                  isScrolled
                    ? "text-blue-600 hover:text-blue-700"
                    : "text-white hover:text-blue-200"
                }`}
              >
                {getContent("navigation", "programsLink", "Хөтөлбөрүүд")}
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <>
                  <span
                    className={`text-sm sm:text-base hidden sm:block transition-colors duration-300 ${
                      isScrolled ? "text-gray-700" : "text-white"
                    }`}
                  >
                    {getContent(
                      "navigation",
                      "welcomeMessage",
                      "Сайн байна уу, {firstName}!"
                    ).replace("{firstName}", user.firstName)}
                  </span>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm"
                    >
                      {getContent("navigation", "adminButton", "Admin Panel")}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm"
                  >
                    {getContent("navigation", "logoutButton", "Гарах")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className={`px-3 sm:px-6 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                    isScrolled
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30"
                  }`}
                >
                  {getContent("navigation", "loginButton", "Нэвтрэх")}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header with enhanced design */}
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
              {getContent("header", "badge", "Хөтөлбөрүүд")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {getContent("header", "title", "Хөтөлбөрүүд")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              {getContent(
                "header",
                "description",
                "Хятадын их сургуулиудад суралцах боломжийг сонгоно уу"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {programs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {getContent("empty", "title", "Хөтөлбөр олдсонгүй")}
            </h3>
            <p className="text-gray-600 text-base sm:text-lg">
              {getContent(
                "empty",
                "message",
                "Одоогоор хөтөлбөр байхгүй байна"
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {programs.map((program) => (
              <div
                key={program.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer transform hover:scale-105 hover:-translate-y-2 border border-gray-100"
                onClick={() => openModal(program)}
              >
                {program.imageUrl ? (
                  <div className="relative h-32 sm:h-48 overflow-hidden">
                    <Image
                      src={program.imageUrl}
                      alt={program.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                ) : (
                  <div className="h-32 sm:h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                    <div className="relative z-10 text-white text-center">
                      <svg
                        className="w-12 h-12 mx-auto mb-2 opacity-80"
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
                      <p className="text-sm font-medium">
                        {getContent(
                          "programs",
                          "fallbackImageText",
                          "Хөтөлбөр"
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {program.title}
                    </h3>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-gray-200">
                      {program.duration}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {program.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3 group-hover:bg-blue-50 transition-colors duration-300">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">{program.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3 group-hover:bg-purple-50 transition-colors duration-300">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors duration-300">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">{program.university}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3 group-hover:bg-green-50 transition-colors duration-300">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors duration-300">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <span className="font-semibold text-green-700">
                        {program.price}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600"
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
                      {getContent(
                        "programs",
                        "requirementsLabel",
                        "Шаардлага:"
                      )}
                    </h4>
                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                      <p className="text-sm text-gray-700">
                        {program.requirements}
                      </p>
                    </div>
                  </div>

                  <button className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 text-sm sm:text-base mt-auto transform hover:scale-105 shadow-md group-hover:shadow-lg">
                    <span className="flex items-center justify-center">
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      {getContent("programs", "applyButton", "Хүсэлт илгээх")}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cool Program Modal */}
      {showModal && selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with white background */}
          <div
            className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
            {/* Modal Header with white background */}
            <div className="relative bg-white border-b border-gray-200 p-6">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
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

              {/* Program title and duration */}
              <div className="pr-12">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {selectedProgram.title}
                  </h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedProgram.duration}
                  </span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">
                  {selectedProgram.university}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {getContent("modal", "descriptionTitle", "Тайлбар")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedProgram.description}
                </p>
              </div>

              {/* Program Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
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
                    <span className="font-medium text-gray-900">Байршил</span>
                  </div>
                  <p className="text-gray-600">{selectedProgram.location}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    <span className="font-medium text-gray-900">Төлбөр</span>
                  </div>
                  <p className="text-gray-600 font-semibold">
                    {selectedProgram.price}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
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
                  {getContent("programs", "requirementsLabel", "Шаардлага")}
                </h3>
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-gray-700">
                    {selectedProgram.requirements}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  {getContent(
                    "modal",
                    "featuresTitle",
                    "Хөтөлбөрийн онцлогууд"
                  )}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-4 h-4 mr-3 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {getContent(
                      "modal",
                      "feature1",
                      "БНХАУ-ын 100% тэтгэлэгийн боломж"
                    )}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-4 h-4 mr-3 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {getContent(
                      "modal",
                      "feature2",
                      "Хэлний мэдлэг шаардахгүй"
                    )}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-4 h-4 mr-3 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {getContent(
                      "modal",
                      "feature3",
                      "Олон улсын стандартын боловсрол"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  {getContent("modal", "closeButton", "Хаах")}
                </button>
                <button className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                  {getContent("modal", "applyButton", "Өргөдөл гаргах")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm"
            onClick={() => setShowAuth(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
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

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin
                  ? getContent("auth", "loginTitle", "Нэвтрэх")
                  : getContent("auth", "signupTitle", "Бүртгүүлэх")}
              </h2>
              <p className="text-gray-600">
                {isLogin
                  ? getContent(
                      "auth",
                      "loginSubtitle",
                      "Бүртгэлээ ашиглан нэвтэрнэ үү"
                    )
                  : getContent(
                      "auth",
                      "signupSubtitle",
                      "Шинэ бүртгэл үүсгэнэ үү"
                    )}
              </p>
            </div>

            {isLogin ? (
              <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
              <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
            )}

            <div className="text-center mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                {isLogin
                  ? getContent(
                      "auth",
                      "switchToSignup",
                      "Бүртгэл байхгүй юу? Бүртгүүлэх"
                    )
                  : getContent(
                      "auth",
                      "switchToLogin",
                      "Бүртгэлтэй юу? Нэвтрэх"
                    )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
