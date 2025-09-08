"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface AdminSidebarProps {
  currentPage?: string;
}

export default function AdminSidebar({
  currentPage = "dashboard",
}: AdminSidebarProps) {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="w-72 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 min-h-screen shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
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
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GrandEdu
            </h2>
            <p className="text-xs text-gray-500">Админ удирдлага</p>
          </div>
        </div>

        <nav className="space-y-3">
          <button
            onClick={() => router.push("/admin")}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentPage === "dashboard"
                ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  currentPage === "dashboard"
                    ? "bg-blue-500"
                    : "bg-blue-100 group-hover:bg-blue-200"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${
                    currentPage === "dashboard" ? "text-white" : "text-blue-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-sm">Админ самбар</div>
                <div className="text-xs text-gray-500">Үндсэн хянах самбар</div>
              </div>
            </div>
          </button>

          <div
            className={`w-full text-left px-4 py-3 rounded-xl ${
              currentPage === "universities"
                ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  currentPage === "universities" ? "bg-blue-500" : "bg-blue-100"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${
                    currentPage === "universities"
                      ? "text-white"
                      : "text-blue-600"
                  }`}
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
              <div>
                <div
                  className={`font-semibold text-sm ${
                    currentPage === "universities" ? "text-blue-700" : ""
                  }`}
                >
                  Их сургуулиуд
                </div>
                <div
                  className={`text-xs ${
                    currentPage === "universities"
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {currentPage === "universities"
                    ? "Өөрчлөлт хийж байна"
                    : "Удирдах"}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Enhanced User Profile Section */}
        <div className="mt-8 pt-6 border-t border-gray-200/50">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user.firstName.charAt(0)}
                  {user.lastName?.charAt(0) || ""}
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-gray-600">{user.email}</div>
                <div className="text-xs text-green-600 font-medium">
                  ● Онлайн
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Вэбсайт руу буцах</span>
          </button>
        </div>
      </div>
    </div>
  );
}
