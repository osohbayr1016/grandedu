"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { getHealthCheckUrl, getHomeContentUrl, getNewsUrl } from "@/utils/api";
import { defaultContent } from "@/utils/defaultContent";

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
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NewsPage() {
  const { showAuth, setShowAuth, isLogin, setIsLogin } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [pageContent, setPageContent] = useState<PageContent>({});
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(getHealthCheckUrl(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(5000),
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
        // Fetch page content and news data in parallel
        const [contentResponse, newsResponse] = await Promise.all([
          fetch(getHomeContentUrl(), {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(10000),
          }),
          fetch(getNewsUrl(), {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(10000),
          }),
        ]);

        // Handle page content
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          setPageContent(contentData);
        } else {
          setPageContent({});
        }

        // Handle news data
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          setNews(newsData);
        } else {
          console.error("Failed to fetch news:", newsResponse.status);
          setNews([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setPageContent({});
        setNews([]);
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
    if (!isConnected || Object.keys(pageContent).length === 0) {
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2z"
                />
              </svg>
              Мэдээ
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              {getContent("news", "title", "Мэдээ мэдээлэл")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              {getContent(
                "news",
                "description",
                "Сүүлийн мэдээ, мэдээллийг эндээс авна уу"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* News list */}
      <main className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {news.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((newsItem) => (
                  <article
                    key={newsItem.id}
                    className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 hover:shadow-xl transition-shadow"
                  >
                    {newsItem.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={newsItem.imageUrl}
                          alt={newsItem.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                        МЭДЭЭ
                      </span>
                      <span className="ml-2 sm:ml-3">
                        {new Date(newsItem.publishDate).toLocaleDateString(
                          "mn-MN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                      {newsItem.title}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base line-clamp-3 mb-3">
                      {newsItem.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Зохиогч: {newsItem.author}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Дэлгэрэнгүй →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
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
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Мэдээ олдсонгүй
                </h3>
                <p className="text-gray-600">
                  Одоогоор мэдээ байхгүй байна. Удахгүй шинэ мэдээ нэмэгдэнэ.
                </p>
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
