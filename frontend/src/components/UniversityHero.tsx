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

interface UniversityHeroProps {
  university: University;
}

export default function UniversityHero({ university }: UniversityHeroProps) {
  const router = useRouter();

  return (
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
        </div>
      </div>
    </div>
  );
}
