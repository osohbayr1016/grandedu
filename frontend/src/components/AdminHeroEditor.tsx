"use client";

import { useState, useEffect } from "react";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";

interface HeroContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaButton: string;
}

interface AdminHeroEditorProps {
  onClose: () => void;
}

export default function AdminHeroEditor({ onClose }: AdminHeroEditorProps) {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "",
    subtitle: "",
    backgroundImage: "",
    ctaButton: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeroContent();
  }, []);

  const loadHeroContent = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/content/home`,
        {},
        token!
      );

      if (response.ok) {
        const data = await response.json();
        // Extract hero section data
        const heroData = data.hero || {};
        setHeroContent({
          title: heroData.title || "",
          subtitle: heroData.subtitle || "",
          backgroundImage: heroData.backgroundImage || "",
          ctaButton: heroData.ctaButton || "",
        });
      }
    } catch (error) {
      console.error("Error loading hero content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      // Save each field separately
      const savePromises = Object.entries(heroContent).map(
        async ([field, content]) => {
          return authenticatedFetch(
            `${getApiBaseUrl()}/api/content`,
            {
              method: "POST",
              body: JSON.stringify({
                page: "home",
                section: "hero",
                field: field,
                content: content,
              }),
            },
            token!
          );
        }
      );

      const results = await Promise.all(savePromises);
      const allSuccessful = results.every((res) => res.ok);

      if (allSuccessful) {
        alert("Hero section мэдээлэл амжилттай хадгалагдлаа!");
        onClose();
      } else {
        alert("Hero section мэдээлэл хадгалах үед алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Error saving hero content:", error);
      alert(
        "Hero section мэдээлэл хадгалах үед алдаа гарлаа: " +
          (error instanceof Error ? error.message : "Тодорхойгүй алдаа")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof HeroContent, value: string) => {
    setHeroContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Ачаалж байна...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hero Section засах
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Гарчиг
            </label>
            <input
              type="text"
              value={heroContent.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Хятадад зуучлах баталгаат хамт олон GrandEdu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дэд гарчиг
            </label>
            <input
              type="text"
              value={heroContent.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Бидэнтэй холбогдоод хятадад амжилттай суралцаарай"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дэвсгэр зураг URL
            </label>
            <input
              type="url"
              value={heroContent.backgroundImage}
              onChange={(e) => handleChange("backgroundImage", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Товчны текст
            </label>
            <input
              type="text"
              value={heroContent.ctaButton}
              onChange={(e) => handleChange("ctaButton", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Эхлэх"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Цуцлах
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Хадгалаж байна..." : "Хадгалах"}
          </button>
        </div>
      </div>
    </div>
  );
}
