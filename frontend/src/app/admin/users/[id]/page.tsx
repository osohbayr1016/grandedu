"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getUsersUrl, authenticatedFetch } from "@/utils/api";

interface UserDetail {
  id: string;
  userCode: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isHighlighted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const fetchUserDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(`${getUsersUrl()}/${userId}`);

      if (response.ok) {
        const data = await response.json();
        setUserDetail(data);
      } else {
        console.error("Failed to fetch user details");
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    if (authLoading || !userId) return;

    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchUserDetail();
  }, [user, authLoading, router, userId, fetchUserDetail]);

  const handleToggleRole = async () => {
    if (!userDetail) return;

    const newRole = userDetail.role === "admin" ? "user" : "admin";
    const confirmMessage = `Энэ хэрэглэгчийг ${
      newRole === "admin" ? "админ" : "энгийн хэрэглэгч"
    } болгохдоо итгэлтэй байна уу?`;

    if (confirm(confirmMessage)) {
      try {
        setUpdating(true);
        const response = await authenticatedFetch(
          `${getUsersUrl()}/${userDetail.id}/role`,
          {
            method: "PATCH",
            body: JSON.stringify({ role: newRole }),
          }
        );

        if (response.ok) {
          const updatedUser = await response.json();
          setUserDetail(updatedUser);
        }
      } catch (error) {
        console.error("Error updating user role:", error);
        alert("Хэрэглэгчийн эрх өөрчлөхөд алдаа гарлаа");
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleToggleHighlight = async () => {
    if (!userDetail) return;

    try {
      setUpdating(true);
      const response = await authenticatedFetch(
        `${getUsersUrl()}/${userDetail.id}/highlight`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUserDetail(updatedUser);
      }
    } catch (error) {
      console.error("Error toggling user highlight:", error);
      alert("Хэрэглэгчийг тэмдэглэхэд алдаа гарлаа");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userDetail) return;

    if (userDetail.id === user?.id) {
      alert("Та өөрийгөө устгаж болохгүй!");
      return;
    }

    const confirmMessage = `"${userDetail.firstName} ${userDetail.lastName}" хэрэглэгчийг бүрмосөн устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.`;

    if (confirm(confirmMessage)) {
      try {
        setUpdating(true);
        const response = await authenticatedFetch(
          `${getUsersUrl()}/${userDetail.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          alert("Хэрэглэгч амжилттай устгагдлаа");
          router.push("/admin");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Хэрэглэгчийг устгахад алдаа гарлаа");
      } finally {
        setUpdating(false);
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Хэрэглэгчийн мэдээлэл ачааллаж байна...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  if (!userDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Хэрэглэгч олдсонгүй</p>
          <button
            onClick={() => router.push("/admin")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Буцах
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/admin")}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Хэрэглэгчийн дэлгэрэнгүй
                </h1>
                <p className="text-sm text-gray-600">
                  Хэрэглэгчийн бүрэн мэдээлэл харах, засах
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">Админ: {user.firstName}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {userDetail.firstName.charAt(0)}
                    {userDetail.lastName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {userDetail.firstName} {userDetail.lastName}
                    </h2>
                    <div className="flex items-center space-x-3 mt-1">
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          userDetail.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {userDetail.role === "admin" ? "Админ" : "Хэрэглэгч"}
                      </span>
                      {userDetail.isHighlighted && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Тэмдэглэгдсэн
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Хэрэглэгчийн ID
                  </label>
                  <div className="flex items-center space-x-3">
                    {userDetail.userCode ? (
                      <>
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-mono text-lg font-bold tracking-wider">
                          {userDetail.userCode}
                        </div>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(userDetail.userCode!)
                          }
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="ID хуулах"
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
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">
                        ID уүсгэгдэж байна...
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Овог
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    {userDetail.lastName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Нэр
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    {userDetail.firstName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Имэйл хаяг
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    {userDetail.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Утасны дугаар
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    {userDetail.phoneNumber}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Бүртгүүлсэн огноо
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                    {new Date(userDetail.createdAt).toLocaleDateString(
                      "mn-MN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Удирдлагын үйлдэл
              </h3>

              <div className="space-y-3">
                <button
                  onClick={handleToggleHighlight}
                  disabled={updating}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    userDetail.isHighlighted
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>
                    {userDetail.isHighlighted ? "Тэмдэглэл хасах" : "Тэмдэглэх"}
                  </span>
                </button>

                <button
                  onClick={handleToggleRole}
                  disabled={updating || userDetail.id === user?.id}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    userDetail.role === "admin"
                      ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    {userDetail.role === "admin"
                      ? "Энгийн хэрэглэгч болгох"
                      : "Админ болгох"}
                  </span>
                </button>

                <button
                  onClick={handleDeleteUser}
                  disabled={updating || userDetail.id === user?.id}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Хэрэглэгч устгах</span>
                </button>
              </div>

              {userDetail.id === user?.id && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Та өөрийн эрх ба профайлыг өөрчлөх боломжгүй
                </p>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Статистик
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Сүүлд өөрчлөгдсөн:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(userDetail.updatedAt).toLocaleDateString("mn-MN")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Дугаар ID:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {userDetail.userCode || "Уүсгэгдэж байна..."}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Статус:</span>
                  <span className="text-sm font-medium text-gray-900">
                    Идэвхтэй
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
