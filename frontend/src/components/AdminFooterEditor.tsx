"use client";

import { useState, useEffect } from "react";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";

interface FooterContent {
  companyDescription: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  privacyPolicy: string;
  termsOfService: string;
  copyright: string;
}

interface AdminFooterEditorProps {
  onClose: () => void;
}

export default function AdminFooterEditor({ onClose }: AdminFooterEditorProps) {
  const [footerContent, setFooterContent] = useState<FooterContent>({
    companyDescription: "",
    email: "",
    phone: "",
    address: "",
    facebook: "",
    instagram: "",
    youtube: "",
    privacyPolicy: "",
    termsOfService: "",
    copyright: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFooterContent();
  }, []);

  const loadFooterContent = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/content/footer`,
        {},
        token!
      );

      if (response.ok) {
        const data = await response.json();
        setFooterContent(data);
      }
    } catch (error) {
      console.error("Error loading footer content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/content/footer`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(footerContent),
        },
        token!
      );

      if (response.ok) {
        alert("Footer мэдээлэл амжилттай хадгалагдлаа!");
        onClose();
      } else {
        alert("Footer мэдээлэл хадгалах үед алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Error saving footer content:", error);
      alert("Footer мэдээлэл хадгалах үед алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof FooterContent, value: string) => {
    setFooterContent((prev) => ({
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
          Footer мэдээлэл засах
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Компанийн тайлбар
            </label>
            <textarea
              value={footerContent.companyDescription}
              onChange={(e) =>
                handleChange("companyDescription", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Компанийн тайлбар оруулах"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имэйл
            </label>
            <input
              type="email"
              value={footerContent.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Утасны дугаар
            </label>
            <input
              type="tel"
              value={footerContent.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+976 1234 5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Хаяг
            </label>
            <textarea
              value={footerContent.address}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Байршлын хаяг"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook линк
            </label>
            <input
              type="url"
              value={footerContent.facebook}
              onChange={(e) => handleChange("facebook", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://facebook.com/yourpage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram линк
            </label>
            <input
              type="url"
              value={footerContent.instagram}
              onChange={(e) => handleChange("instagram", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://instagram.com/yourpage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube линк
            </label>
            <input
              type="url"
              value={footerContent.youtube}
              onChange={(e) => handleChange("youtube", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://youtube.com/yourchannel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Нууцлалын бодлого
            </label>
            <input
              type="url"
              value={footerContent.privacyPolicy}
              onChange={(e) => handleChange("privacyPolicy", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Нууцлалын бодлогын линк"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Үйлчилгээний нөхцөл
            </label>
            <input
              type="url"
              value={footerContent.termsOfService}
              onChange={(e) => handleChange("termsOfService", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Үйлчилгээний нөхцлийн линк"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Зохиогчийн эрх
            </label>
            <input
              type="text"
              value={footerContent.copyright}
              onChange={(e) => handleChange("copyright", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="© 2024 GrandEdu. Бүх эрх хуулиар хамгаалагдсан."
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
