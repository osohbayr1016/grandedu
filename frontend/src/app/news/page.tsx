"use client";

import { useEffect, useState } from "react";
import { getHealthCheckUrl, getHomeContentUrl } from "@/utils/api";
import { defaultContent } from "@/utils/defaultContent";

interface PageContent {
  [section: string]: {
    [field: string]: string;
  };
}

export default function NewsPage() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [pageContent, setPageContent] = useState<PageContent>({});
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
    const fetchPageContent = async () => {
      try {
        // Reuse home content endpoint to keep design consistent (news content is under "news" section)
        const response = await fetch(getHomeContentUrl(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(10000),
        });
        if (response.ok) {
          const data = await response.json();
          setPageContent(data);
        } else {
          setPageContent({});
        }
      } catch {
        setPageContent({});
      } finally {
        setLoading(false);
      }
    };
    fetchPageContent();
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

      {/* News list (same card style as home) */}
      <main className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Example cards: replicate the home news card style with more spacing */}
            {[1, 2, 3].map((idx) => (
              <article
                key={idx}
                className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200"
              >
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                    {getContent("news", "newsCardTag", "ХӨТӨЛБӨР")}
                  </span>
                  <span className="ml-2 sm:ml-3">
                    {getContent("news", "newsCardDate", "2025 оны 6-р сар")}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {getContent(
                    "news",
                    "newsCardTitle",
                    "6+6 Хятад хэлний бэлтгэл хөтөлбөр (2025 оны 6-р сарын элсэлт)"
                  )}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {getContent(
                    "news",
                    "newsCardDescription",
                    "Монголд 6 сар, Хятадт 6-11 сар хэлний бэлтгэл"
                  )}
                </p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
