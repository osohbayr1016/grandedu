"use client";

import { useState } from "react";
import { Course } from "@/types";
import Image from "next/image";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";

interface AdminCoursesTableProps {
  courses: Course[];
  onUpdate: () => void;
  onEdit: (course: Course) => void;
  onAdd?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function AdminCoursesTable({
  courses,
  onUpdate,
  onEdit,
  onAdd,
  searchQuery = "",
  onSearchChange,
}: AdminCoursesTableProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleActive = async (course: Course) => {
    setLoading(course.id);
    try {
      const token = localStorage.getItem("token");
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/courses/${course.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...course,
            isActive: !course.isActive,
          }),
        },
        token!
      );

      if (response.ok) {
        onUpdate();
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(null);
    }
  };

  const handleToggleHighlight = async (course: Course) => {
    setLoading(course.id);
    try {
      const token = localStorage.getItem("token");
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/courses/${course.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...course,
            isHighlighted: !course.isHighlighted,
          }),
        },
        token!
      );

      if (response.ok) {
        onUpdate();
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!confirm(`"${course.title}" сургалтыг устгахдаа итгэлтэй байна уу?`)) {
      return;
    }

    setLoading(course.id);
    try {
      const token = localStorage.getItem("token");
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/courses/${course.id}`,
        {
          method: "DELETE",
        },
        token!
      );

      if (response.ok) {
        onUpdate();
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(null);
    }
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Сургалтууд</h3>
          {onAdd && (
            <button
              onClick={onAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Шинэ сургалт нэмэх
            </button>
          )}
        </div>

        {/* Search Bar */}
        {onSearchChange && (
          <div className="relative">
            <input
              type="text"
              placeholder="Сургалт хайх..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сургалт
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Хугацаа
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Түвшин
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Төлөв
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  {searchQuery
                    ? "Хайлтын үр дүн олдсонгүй"
                    : "Сургалт олдсонгүй"}
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {course.imageUrl ? (
                          <Image
                            className="h-10 w-10 rounded-full object-cover"
                            src={course.imageUrl}
                            alt={course.title}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {course.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                          {course.isHighlighted && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Онцлох
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.description.length > 50
                            ? `${course.description.substring(0, 50)}...`
                            : course.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.level}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {course.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => onEdit(course)}
                      className="text-indigo-600 hover:text-indigo-900"
                      disabled={loading === course.id}
                    >
                      Засах
                    </button>
                    <button
                      onClick={() => handleToggleActive(course)}
                      className={`${
                        course.isActive
                          ? "text-red-600 hover:text-red-900"
                          : "text-green-600 hover:text-green-900"
                      }`}
                      disabled={loading === course.id}
                    >
                      {loading === course.id
                        ? "Түр хүлээнэ үү..."
                        : course.isActive
                        ? "Идэвхгүй болгох"
                        : "Идэвхжүүлэх"}
                    </button>
                    <button
                      onClick={() => handleToggleHighlight(course)}
                      className={`${
                        course.isHighlighted
                          ? "text-yellow-600 hover:text-yellow-900"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      disabled={loading === course.id}
                    >
                      {course.isHighlighted ? "Онцлохыг цуцлах" : "Онцлох"}
                    </button>
                    <button
                      onClick={() => handleDelete(course)}
                      className="text-red-600 hover:text-red-900"
                      disabled={loading === course.id}
                    >
                      Устгах
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
