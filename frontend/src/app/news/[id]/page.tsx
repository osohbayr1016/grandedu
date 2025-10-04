"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { getNewsUrl } from "@/utils/api";
import Link from "next/link";
import { createTimeoutSignal } from "@/utils/requestUtils";

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

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showAuth, setShowAuth, isLogin, setIsLogin } = useAuth();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);

  useEffect(() => {
    fetchNews();
    fetchRelatedNews();
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNews = async () => {
    try {
      const newsId = params.id as string;
      const response = await fetch(`${getNewsUrl()}/${newsId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: createTimeoutSignal(10000),
      });

      if (response.ok) {
        const data = await response.json();
        setNews(data);
      } else if (response.status === 404) {
        router.push("/news");
      } else {
        console.error("Failed to fetch news");
        router.push("/news");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      router.push("/news");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async () => {
    try {
      const response = await fetch(getNewsUrl(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: createTimeoutSignal(10000),
      });

      if (response.ok) {
        const data = await response.json();
        // Filter out current news and limit to 3 related articles
        const filtered = data
          .filter((item: News) => item.id !== params.id && item.isActive)
          .slice(0, 3);
        setRelatedNews(filtered);
      }
    } catch (error) {
      console.error("Error fetching related news:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Мэдээ ачаалж байна...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Мэдээ олдсонгүй
          </h1>
          <p className="text-gray-600 mb-6">
            Хайж буй мэдээ олдсонгүй эсвэл устгагдсан байна.
          </p>
          <Link
            href="/news"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Мэдээний хуудас руу буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Нүүр хуудас
            </Link>
            <span>/</span>
            <Link href="/news" className="hover:text-blue-600">
              Мэдээ
            </Link>
            <span>/</span>
            <span className="text-gray-900 line-clamp-1">{news.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  МЭДЭЭ
                </span>
                <span className="ml-3">
                  {new Date(news.publishDate).toLocaleDateString("mn-MN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="ml-3">•</span>
                <span className="ml-3">Зохиогч: {news.author}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {news.title}
              </h1>
              {news.imageUrl && (
                <div className="mb-8">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
            </header>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {news.content}
              </div>
            </article>

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Хамгийн сүүлд шинэчилсэн:{" "}
                  {new Date(news.updatedAt).toLocaleDateString("mn-MN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <Link
                  href="/news"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  ← Бүх мэдээ үзэх
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </main>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                Холбоотой мэдээ
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedNews.map((newsItem) => (
                  <Link
                    key={newsItem.id}
                    href={`/news/${newsItem.id}`}
                    className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow group"
                  >
                    {newsItem.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={newsItem.imageUrl}
                          alt={newsItem.title}
                          className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        МЭДЭЭ
                      </span>
                      <span className="ml-2">
                        {new Date(newsItem.publishDate).toLocaleDateString(
                          "mn-MN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {newsItem.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {newsItem.content}
                    </p>
                    <div className="mt-4 text-xs text-gray-500">
                      Зохиогч: {newsItem.author}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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
