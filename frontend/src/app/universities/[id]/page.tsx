"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { getUniversitiesUrl } from "@/utils/api";

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

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showAuth, setShowAuth, isLogin, setIsLogin } = useAuth();
  const [university, setUniversity] = useState<University | null>(null);

  useEffect(() => {
    fetchUniversity();
  }, [params.id, router]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUniversity = async () => {
    try {
      const universityId = params.id as string;
      const response = await fetch(`${getUniversitiesUrl()}/${universityId}`);

      if (response.ok) {
        const data = await response.json();
        setUniversity(data);
      } else {
        console.error("Failed to fetch university");
        router.push("/universities");
      }
    } catch (error) {
      console.error("Error fetching university:", error);
      router.push("/universities");
    }
  };

  if (!university) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
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
            <div className="flex justify-center mb-4">
              <button
                onClick={() => router.push("/universities")}
                className="mr-4 p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
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
              Их сургууль
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              {university.name}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-2">
              {university.location}
            </p>
            <p className="text-base text-gray-600">{university.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* University Overview */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-blue-600"
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
                  </div>
                  Их сургуулийн ерөнхий мэдээлэл
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Тайлбар
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {university.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Байршил
                    </h3>
                    <p className="text-gray-600">{university.location}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Programs Section */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-green-600"
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
                  </div>
                  Хөтөлбөрүүд
                </h2>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Хөтөлбөрийн дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.
                  </p>
                </div>
              </div>
            </section>

            {/* Facilities Section */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-purple-600"
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
                  Суурь талбай, тоног төхөөрөмж
                </h2>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Суурь талбайн дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.
                  </p>
                </div>
              </div>
            </section>

            {/* Admission Requirements Section */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-orange-600"
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
                  </div>
                  Элсэлтийн шаардлага
                </h2>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Элсэлтийн шаардлагын дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.
                  </p>
                </div>
              </div>
            </section>

            {/* City Life Section */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-red-600"
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
                  Хотын амьдрал
                </h2>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Хотын амьдралын дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Холбоо барих</h2>
                <p className="text-blue-50 mb-6">
                  Энэ их сургуулийн талаар дэлгэрэнгүй мэдэхийг хүсвэл бидэнтэй
                  холбогдоно уу.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Дэлгэрэнгүй мэдээлэл
                  </button>
                  <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                    Холбоо барих
                  </button>
                </div>
              </div>
            </section>
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
