"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getHealthCheckUrl,
  getHomeContentUrl,
  getUniversitiesUrl,
} from "@/utils/api";
import { defaultContent } from "@/utils/defaultContent";

interface PageContent {
  [section: string]: {
    [field: string]: string;
  };
}

interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UniversitiesPage() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [pageContent, setPageContent] = useState<PageContent>({});
  const [universities, setUniversities] = useState<University[]>([]);
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
        // Fetch page content
        const contentResponse = await fetch(getHomeContentUrl(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(10000),
        });
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          setPageContent(contentData);
        } else {
          setPageContent({});
        }

        // Fetch universities
        const universitiesResponse = await fetch(getUniversitiesUrl(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(10000),
        });
        if (universitiesResponse.ok) {
          const universitiesData = await universitiesResponse.json();
          setUniversities(universitiesData);
        } else {
          setUniversities([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setPageContent({});
        setUniversities([]);
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
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
              </svg>
              Их сургуулиуд
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              {getContent("universities", "title", "Их сургуулиуд")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              {getContent(
                "universities",
                "description",
                "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Universities Grid */}
      <main className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.length > 0 ? (
              universities.map((university) => (
                <article
                  key={university.id}
                  onClick={() => router.push(`/universities/${university.id}`)}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="h-32 sm:h-48 relative overflow-hidden">
                    {university.imageUrl ? (
                      <img
                        src={university.imageUrl}
                        alt={university.name}
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
                            {university.name}
                          </h3>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {university.name}
                    </h3>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                      {university.location}
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3">
                      {university.description}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/universities/${university.id}`);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Дэлгэрэнгүй үзэх →
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <p className="text-lg font-medium">Их сургууль олдсонгүй</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Их сургуулиудын мэдээлэл удахгүй нэмэгдэнэ.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
