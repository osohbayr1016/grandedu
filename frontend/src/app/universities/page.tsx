"use client";

import { useEffect, useState } from "react";
import { getHealthCheckUrl, getHomeContentUrl } from "@/utils/api";
import { defaultContent } from "@/utils/defaultContent";

interface PageContent {
  [section: string]: {
    [field: string]: string;
  };
}

export default function UniversitiesPage() {
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

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">
            {getContent("universities", "title", "Их сургуулиуд")}
          </h1>
          <p className="text-blue-50 mt-2">
            {getContent(
              "universities",
              "description",
              "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг"
            )}
          </p>
        </div>
      </header>

      {/* Universities Grid */}
      <main className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <article
                key={idx}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
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
                      {idx === 1
                        ? getContent(
                            "universities",
                            "university1Name",
                            "Сычуань их сургууль"
                          )
                        : idx === 2
                        ? getContent(
                            "universities",
                            "university2Name",
                            "Хятадын Шинжлэх Ухаан, Технологийн Их Сургууль"
                          )
                        : getContent(
                            "universities",
                            "university3Name",
                            "Шанхайн Жяо Тонгийн Их Сургууль"
                          )}
                    </h3>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                    {idx === 1
                      ? getContent(
                          "universities",
                          "university1Location",
                          "Чэнду, Сычуань"
                        )
                      : idx === 2
                      ? getContent(
                          "universities",
                          "university2Location",
                          "Хэфэй, Аньхой"
                        )
                      : getContent(
                          "universities",
                          "university3Location",
                          "Шанхай"
                        )}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Хөтөлбөр, сургалтын орчин, хотын амьдрал болон элсэлтийн
                    ерөнхий мэдээллийг эндээс үзнэ үү.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
