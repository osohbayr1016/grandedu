"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";
import { CourseRegistration, SavedCourse } from "@/types";

export default function ProfilePage() {
  const { user, loading, logout, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  const [loadingSavedCourses, setLoadingSavedCourses] = useState(true);

  const fetchRegistrations = useCallback(async () => {
    setLoadingRegistrations(true);
    try {
      const token = localStorage.getItem("token");
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/registrations/my-registrations`,
        {},
        token!
      );

      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoadingRegistrations(false);
    }
  }, []);

  const fetchSavedCourses = useCallback(async () => {
    setLoadingSavedCourses(true);
    try {
      const token = localStorage.getItem("token");
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/saved-courses/my-saved`,
        {},
        token!
      );

      if (response.ok) {
        const data = await response.json();
        setSavedCourses(data);
      }
    } catch (error) {
      console.error("Error fetching saved courses:", error);
    } finally {
      setLoadingSavedCourses(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
      });
      fetchRegistrations();
      fetchSavedCourses();
    }
  }, [user, loading, router, fetchRegistrations, fetchSavedCourses]);

  const handleUnsaveCourse = async (courseId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/saved-courses/${courseId}`,
        {
          method: "DELETE",
        },
        token!
      );

      if (response.ok) {
        fetchSavedCourses();
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error unsaving course:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      alert("Бүх талбарыг бөглөнө үү!");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/auth/profile`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        },
        token!
      );

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        setIsEditing(false);
        alert("Профайл амжилттай шинэчлэгдлээ!");
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
    });
    setIsEditing(false);
  };

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
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Хувийн мэдээлэл
                      </h3>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          ✏️ Засах
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Нэр
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                            {user.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Овог
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                            {user.lastName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Имэйл хаяг
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {user.email}
                        </p>
                        {isEditing && (
                          <p className="text-xs text-gray-500 mt-1">
                            Имэйл хаягийг солих боломжгүй
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Утасны дугаар
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phoneNumber: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                            {user.phoneNumber}
                          </p>
                        )}
                      </div>

                      {isEditing && (
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                          >
                            {saving ? "Хадгалж байна..." : "Хадгалах"}
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                          >
                            Цуцлах
                          </button>
                        </div>
                      )}
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

            {/* My Registrations Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-6">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
                <h3 className="text-lg font-semibold text-white">
                  Миний бүртгүүлсэн сургалтууд
                </h3>
              </div>
              <div className="p-6">
                {loadingRegistrations ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">Ачаалж байна...</p>
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-8">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">
                      Бүртгүүлсэн сургалт байхгүй байна
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Сургалтууд хуудас руу очиж бүртгүүлнэ үү
                    </p>
                    <Link
                      href="/courses"
                      className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Сургалтууд үзэх →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registrations.map((registration) => (
                      <div
                        key={registration.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {registration.course.title}
                          </h4>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              registration.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : registration.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {registration.status === "confirmed"
                              ? "Баталгаажсан"
                              : registration.status === "cancelled"
                              ? "Цуцлагдсан"
                              : "Хүлээгдэж буй"}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Түвшин:</span>{" "}
                            {registration.course.level}
                          </p>
                          <p>
                            <span className="font-medium">Хугацаа:</span>{" "}
                            {registration.course.duration}
                          </p>
                          <p>
                            <span className="font-medium">
                              Бүртгүүлсэн огноо:
                            </span>{" "}
                            {new Date(
                              registration.createdAt
                            ).toLocaleDateString("mn-MN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          {registration.notes && (
                            <p>
                              <span className="font-medium">Тэмдэглэл:</span>{" "}
                              {registration.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Saved Courses Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-6">
              <div className="px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500">
                <h3 className="text-lg font-semibold text-white">
                  ⭐ Хадгалсан сургалтууд
                </h3>
              </div>
              <div className="p-6">
                {loadingSavedCourses ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">Ачаалж байна...</p>
                  </div>
                ) : savedCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">
                      Хадгалсан сургалт байхгүй байна
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Сургалтыг үзээд хадгална уу
                    </p>
                    <Link
                      href="/courses"
                      className="inline-block mt-4 text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      Сургалтууд үзэх →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedCourses.map((saved) => (
                      <div
                        key={saved.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {saved.course.title}
                          </h4>
                          <button
                            onClick={() => handleUnsaveCourse(saved.course.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Устгах
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {saved.course.description}
                        </p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Түвшин:</span>{" "}
                            {saved.course.level}
                          </p>
                          <p>
                            <span className="font-medium">Хугацаа:</span>{" "}
                            {saved.course.duration}
                          </p>
                          {saved.course.price && (
                            <p>
                              <span className="font-medium">Үнэ:</span>{" "}
                              {saved.course.price}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            Хадгалсан огноо:{" "}
                            {new Date(saved.createdAt).toLocaleDateString(
                              "mn-MN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <Link
                          href="/courses"
                          className="inline-block mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Дэлгэрэнгүй үзэх →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
