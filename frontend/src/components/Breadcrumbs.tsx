"use client";

import { useRouter } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const router = useRouter();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && (
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          {item.href ? (
            <button
              onClick={() => router.push(item.href!)}
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span
              className={
                index === items.length - 1
                  ? "text-blue-600 font-medium"
                  : "text-gray-700 font-medium"
              }
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
