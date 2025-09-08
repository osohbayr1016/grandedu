"use client";

import { useRouter } from "next/navigation";

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

interface UniversityHeaderProps {
  university: University;
  onToggleStatus: () => Promise<void>;
}

export default function UniversityHeader({
  university,
  onToggleStatus,
}: UniversityHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {university.name}
              </h1>
              <p className="text-gray-600 mt-1 flex items-center space-x-2">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{university.location}</span>
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-3 max-w-2xl">
            Их сургуулийн дэлгэрэнгүй мэдээллийг засварлах, статус өөрчлөх болон
            бусад тохиргоо хийх
          </p>
        </div>
        <div className="flex items-center space-x-3 ml-4">
          <button
            onClick={onToggleStatus}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
              university.isActive
                ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                university.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span>{university.isActive ? "Идэвхтэй" : "Идэвхгүй"}</span>
          </button>
          <button
            onClick={() => router.push(`/universities/${university.id}`)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>Харах</span>
          </button>
        </div>
      </div>
    </div>
  );
}
