"use client";

interface Section {
  id: string;
  name: string;
  description: string;
}

interface AdminHeaderProps {
  activeSection: string;
  sections: Section[];
}

export default function AdminHeader({
  activeSection,
  sections,
}: AdminHeaderProps) {
  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <div className="relative bg-white shadow-lg overflow-hidden rounded-lg mb-8">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute top-1/2 right-0 w-48 h-48 bg-purple-600 rounded-full translate-x-24 -translate-y-24"></div>
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-indigo-600 rounded-full translate-y-16"></div>
      </div>

      <div className="p-8 relative z-10">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Админ самбар
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            {currentSection?.name || "Админ самбар"}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            {currentSection?.description || "Системийн удирдлага"}
          </p>
        </div>
      </div>
    </div>
  );
}
