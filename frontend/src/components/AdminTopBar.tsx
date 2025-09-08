"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function AdminTopBar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
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
            <span className="text-sm font-medium text-gray-700">
              grandedu.mn/admin
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {user.firstName.charAt(0)}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user.firstName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
