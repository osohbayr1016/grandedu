"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  programs: string[];
  facilities: string[];
  admissionRequirements: string[];
  cityLife: string[];
  isActive: boolean;
}

export default function AdminUniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<
    "programs" | "facilities" | "admissionRequirements" | "cityLife"
  >("programs");
  const [newItem, setNewItem] = useState("");

  // Sample university data
  const universitiesData: University[] = [
    {
      id: "1",
      name: "Сычуань их сургууль",
      location: "Чэнду, Сычуань",
      description: "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг",
      imageUrl: "https://example.com/sichuan.jpg",
      programs: [
        "Бакалаврын хөтөлбөр - 4 жил",
        "Магистрын хөтөлбөр - 2 жил",
        "Докторын хөтөлбөр - 3-4 жил",
      ],
      facilities: [
        "Орчин үеийн сургалтын танхимууд",
        "Номын сан",
        "Спорт заал",
        "Оюутны дотуур байр",
        "Цахим сургалтын систем",
      ],
      admissionRequirements: [
        "12 жилийн боловсрол",
        "IELTS 6.0 эсвэл TOEFL 80+",
        "Хятад хэлний HSK 4+",
        "Академик дундаж 3.0+",
        "Урьдчилсан мэдлэг",
      ],
      cityLife: [
        "Чэнду - Хятадын 4-р том хот",
        "Хятадын байгаль, соёлын төв",
        "Хоолны соёл, технологийн хөгжил",
        "Олон улсын компаниудын төв",
        "Аялал жуулчлалын хөгжлийн",
      ],
      isActive: true,
    },
    {
      id: "2",
      name: "Хятадын Шинжлэх Ухаан, Технологийн Их Сургууль",
      location: "Хэфэй, Аньхой",
      description: "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг",
      imageUrl: "https://example.com/ustc.jpg",
      programs: [
        "Инженерийн хөтөлбөрүүд",
        "Шинжлэх ухааны хөтөлбөрүүд",
        "Технологийн хөтөлбөрүүд",
      ],
      facilities: [
        "Дэлгэрэнгүй лабораториуд",
        "Судалгааны төвүүд",
        "Олон улсын хамтын ажиллагаа",
        "Инновацийн парк",
      ],
      admissionRequirements: [
        "Математик, физикийн сайн мэдлэг",
        "Англи хэлний түвшин",
        "Хятад хэлний мэдлэг",
        "Академик хөгжил",
      ],
      cityLife: [
        "Хэфэй - Аньхой мужийн төв",
        "Технологийн хөгжлийн хот",
        "Байгаль орчны цэвэр",
        "Хятадын соёлын төв",
      ],
      isActive: true,
    },
    {
      id: "3",
      name: "Шанхайн Жяо Тонгийн Их Сургууль",
      location: "Шанхай",
      description: "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг",
      imageUrl: "https://example.com/sjtu.jpg",
      programs: [
        "Бизнес удирдлага",
        "Инженерийн чиглэлүүд",
        "Хууль эрх зүй",
        "Хэл, соёл",
      ],
      facilities: [
        "Олон улсын стандартын сургалт",
        "Бизнес инкубатор",
        "Хэлний сургалтын төв",
        "Оюутны үйл ажиллагааны төв",
      ],
      admissionRequirements: [
        "Англи хэлний түвшин",
        "Хятад хэлний мэдлэг",
        "Академик дундаж",
        "Хувийн мэдээлэл",
      ],
      cityLife: [
        "Шанхай - Хятадын хамгийн том хот",
        "Олон улсын санхүүгийн төв",
        "Худалдаа, үйлдвэрлэлийн төв",
        "Олон улсын соёлын хөгжил",
      ],
      isActive: true,
    },
  ];

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    const universityId = params.id as string;
    const foundUniversity = universitiesData.find(
      (uni) => uni.id === universityId
    );
    if (foundUniversity) {
      setUniversity(foundUniversity);
    } else {
      router.push("/admin");
    }
    setLoading(false);
  }, [params.id, router, user, authLoading]);

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleSave = async () => {
    if (!editingField || !university) return;

    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUniversity((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [editingField]: editValue,
        };
      });
      setEditingField(null);
      setEditValue("");
    } catch (error) {
      console.error("Хадгалахад алдаа гарлаа:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleAddItem = () => {
    if (!newItem.trim() || !university) return;

    setUniversity((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [addModalType]: [...prev[addModalType], newItem],
      };
    });

    setNewItem("");
    setShowAddModal(false);
  };

  const handleRemoveItem = (type: keyof University, index: number) => {
    if (!university) return;

    setUniversity((prev) => {
      if (!prev) return prev;
      const newArray = [...(prev[type] as string[])];
      newArray.splice(index, 1);
      return {
        ...prev,
        [type]: newArray,
      };
    });
  };

  const handleToggleStatus = () => {
    if (!university) return;

    setUniversity((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isActive: !prev.isActive,
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Их сургууль олдсонгүй</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">grandedu.mn/admin</div>
          <div className="text-sm text-gray-600">Админ: {user.firstName}</div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              GrandEdu Админ
            </h2>

            <nav className="space-y-2">
              <button
                onClick={() => router.push("/admin")}
                className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🏠</span>
                  <div>
                    <div className="font-medium text-sm">Админ самбар</div>
                    <div className="text-xs text-gray-500">
                      Үндсэн хянах самбар
                    </div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => router.push("/admin")}
                className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🎓</span>
                  <div>
                    <div className="font-medium text-sm">Их сургуулиуд</div>
                    <div className="text-xs text-gray-500">
                      Их сургуулийн жагсаалт
                    </div>
                  </div>
                </div>
              </button>
            </nav>

            {/* User Profile Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-3 py-2">
                <svg
                  className="w-5 h-5 text-gray-600"
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
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => router.push("/")}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 mt-2"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Вэбсайт руу буцах</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => router.push("/admin")}
                  className="flex items-center text-blue-600 hover:text-blue-700 mb-2"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Админ самбар руу буцах
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                  {university.name} - Засвар
                </h1>
                <p className="text-gray-600 mt-2">
                  Их сургуулийн дэлгэрэнгүй мэдээллийг засварлах
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToggleStatus}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    university.isActive
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
                >
                  {university.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                </button>
                <button
                  onClick={() => router.push(`/universities/${university.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Харах
                </button>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Үндсэн мэдээлэл
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Их сургуулийн нэр
                </label>
                {editingField === "name" ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:opacity-50"
                      >
                        {saving ? "Хадгалж байна..." : "Хадгалах"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                      >
                        Цуцлах
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-900">{university.name}</p>
                    <button
                      onClick={() => startEditing("name", university.name)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Засах
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Байршил
                </label>
                {editingField === "location" ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:opacity-50"
                      >
                        {saving ? "Хадгалж байна..." : "Хадгалах"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                      >
                        Цуцлах
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-900">{university.location}</p>
                    <button
                      onClick={() =>
                        startEditing("location", university.location)
                      }
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Засах
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тайлбар
                </label>
                {editingField === "description" ? (
                  <div className="space-y-2">
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:opacity-50"
                      >
                        {saving ? "Хадгалж байна..." : "Хадгалах"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                      >
                        Цуцлах
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <p className="text-gray-900 flex-1">
                      {university.description}
                    </p>
                    <button
                      onClick={() =>
                        startEditing("description", university.description)
                      }
                      className="text-blue-600 hover:text-blue-700 text-sm ml-4"
                    >
                      Засах
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Зургийн URL
                </label>
                {editingField === "imageUrl" ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:opacity-50"
                      >
                        {saving ? "Хадгалж байна..." : "Хадгалах"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                      >
                        Цуцлах
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-900">{university.imageUrl}</p>
                    <button
                      onClick={() =>
                        startEditing("imageUrl", university.imageUrl)
                      }
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Засах
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Programs Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Хөтөлбөрүүд
              </h2>
              <button
                onClick={() => {
                  setAddModalType("programs");
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                + Нэмэх
              </button>
            </div>
            <div className="space-y-3">
              {university.programs.map((program, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-900">{program}</span>
                  <button
                    onClick={() => handleRemoveItem("programs", index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Устгах
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Суурь талбай, тоног төхөөрөмж
              </h2>
              <button
                onClick={() => {
                  setAddModalType("facilities");
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                + Нэмэх
              </button>
            </div>
            <div className="space-y-3">
              {university.facilities.map((facility, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-900">{facility}</span>
                  <button
                    onClick={() => handleRemoveItem("facilities", index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Устгах
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Admission Requirements Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Элсэлтийн шаардлага
              </h2>
              <button
                onClick={() => {
                  setAddModalType("admissionRequirements");
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                + Нэмэх
              </button>
            </div>
            <div className="space-y-3">
              {university.admissionRequirements.map((requirement, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-900">{requirement}</span>
                  <button
                    onClick={() =>
                      handleRemoveItem("admissionRequirements", index)
                    }
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Устгах
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* City Life Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Хотын амьдрал
              </h2>
              <button
                onClick={() => {
                  setAddModalType("cityLife");
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                + Нэмэх
              </button>
            </div>
            <div className="space-y-3">
              {university.cityLife.map((life, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-900">{life}</span>
                  <button
                    onClick={() => handleRemoveItem("cityLife", index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Устгах
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {addModalType === "programs" && "Шинэ хөтөлбөр нэмэх"}
                  {addModalType === "facilities" && "Шинэ суурь талбай нэмэх"}
                  {addModalType === "admissionRequirements" &&
                    "Шинэ шаардлага нэмэх"}
                  {addModalType === "cityLife" && "Шинэ хотын амьдрал нэмэх"}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {addModalType === "programs" && "Хөтөлбөрийн нэр"}
                    {addModalType === "facilities" && "Суурь талбайн нэр"}
                    {addModalType === "admissionRequirements" &&
                      "Шаардлагын тайлбар"}
                    {addModalType === "cityLife" && "Хотын амьдралын тайлбар"}
                  </label>
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Оруулна уу..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Нэмэх
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
