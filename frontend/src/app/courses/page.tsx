"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import {
  getHealthCheckUrl,
  getHomeContentUrl,
  getCoursesUrl,
} from "@/utils/api";
import { createTimeoutSignal } from "@/utils/requestUtils";

interface PageContent {
  [section: string]: {
    [field: string]: string;
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price?: string;
  instructor?: string;
  schedule?: string;
  requirements?: string;
  imageUrl?: string;
  registrationLink?: string;
  adminNote?: string;
  isActive: boolean;
  isHighlighted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const { showAuth, setShowAuth, isLogin, setIsLogin } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [pageContent, setPageContent] = useState<PageContent>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(getHealthCheckUrl(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: createTimeoutSignal(5000),
        });
        setIsConnected(response.ok);
      } catch {
        setIsConnected(false);
      }
    };
    checkBackendHealth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch page content
        const contentResponse = await fetch(getHomeContentUrl(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: createTimeoutSignal(10000),
        });
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          setPageContent(contentData);
        } else {
          setPageContent({});
        }

        // Fetch courses
        const coursesResponse = await fetch(getCoursesUrl(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: createTimeoutSignal(10000),
        });
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          setCourses(coursesData);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setPageContent({});
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getContent = (
    section: string,
    field: string,
    fallback: string = ""
  ) => {
    if (!isConnected) {
      return fallback;
    }
    return pageContent[section]?.[field] ?? fallback;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ачаалж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation is provided by the global layout */}

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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Сургалтууд
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              {getContent("courses", "title", "Сургалтууд")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              {getContent(
                "courses",
                "description",
                "Хятад хэлний сургалт болон бусад мэргэжлийн сургалтууд"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <main className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <article
                  key={course.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="h-32 sm:h-48 relative overflow-hidden">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
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
                            {course.title}
                          </h3>
                        </div>
                      </div>
                    )}
                    {/* Featured Badge */}
                    {course.isHighlighted && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          <span>ОНЦЛОХ</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                      {course.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 text-green-600"
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
                        <span className="font-medium">{course.level}</span>
                      </div>
                      {course.instructor && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 mr-2 text-purple-600"
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
                          <span className="font-medium">
                            {course.instructor}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (course.registrationLink) {
                          window.open(
                            course.registrationLink,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        } else {
                          alert("Бүртгүүлэх холбоос одоогоор боломжгүй байна.");
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Бүртгүүлэх →
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 opacity-50"
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
                  <p className="text-lg font-medium">Сургалт олдсонгүй</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Сургалтуудын мэдээлэл удахгүй нэмэгдэнэ.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Authentication Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="relative animate-scale-in">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center"
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
      )}
    </div>
  );
}
