"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Хэрэглэгчийн профайл
            </h1>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Нүүр хуудас руу буцах
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-white"
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
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-blue-100">
                      {user.role === "admin" ? "Админ" : "Хэрэглэгч"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User ID */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      Хэрэглэгчийн ID
                    </label>
                    {user.userCode ? (
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-mono text-lg font-bold tracking-wider">
                          {user.userCode}
                        </div>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(user.userCode!)
                          }
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="ID хуулах"
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
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">
                        ID уүсгэгдэж байна...
                      </div>
                    )}
                    <p className="text-xs text-blue-600 mt-2">
                      Энэ ID-г админтай харилцахдаа ашиглана уу
                    </p>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Хувийн мэдээлэл
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Нэр
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {user.firstName}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Овог
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {user.lastName}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Имэйл хаяг
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {user.email}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Утасны дугаар
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {user.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Тохиргоо
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Админ хэсэг
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Гарах
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
