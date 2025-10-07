"use client";

import { useState, useEffect } from "react";
import { News } from "@/types";
import Modal from "@/components/Modal";

interface NewsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  news?: News | null;
  onSave: (newsData: Partial<News>) => void;
  loading?: boolean;
}

export default function NewsFormModal({
  isOpen,
  onClose,
  news,
  onSave,
  loading = false,
}: NewsFormModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    publishDate: "",
    imageUrl: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        content: news.content || "",
        author: news.author || "",
        publishDate: news.publishDate || "",
        imageUrl: news.imageUrl || "",
        isActive: news.isActive ?? true,
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        title: "",
        content: "",
        author: "",
        publishDate: today,
        imageUrl: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [news, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Мэдээний гарчиг заавал оруулах шаардлагатай";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Мэдээний агуулга заавал оруулах шаардлагатай";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Зохиогчийн нэр заавал оруулах шаардлагатай";
    }

    if (!formData.publishDate.trim()) {
      newErrors.publishDate = "Нийтлэх огноо заавал оруулах шаардлагатай";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={news ? "Мэдээ засах" : "Шинэ мэдээ нэмэх"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Мэдээний гарчиг *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Мэдээний гарчиг оруулна уу"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Зохиогч *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.author ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Зохиогчийн нэр"
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Нийтлэх огноо *
            </label>
            <input
              type="date"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.publishDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.publishDate && (
              <p className="mt-1 text-sm text-red-600">{errors.publishDate}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Мэдээний агуулга *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={8}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Мэдээний дэлгэрэнгүй агуулга оруулна уу"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Зураг URL
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/news-image.jpg"
          />
        </div>

        {/* Status toggle */}
        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Идэвхтэй</span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
          >
            Цуцлах
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Хадгалж байна..." : news ? "Хадгалах" : "Нэмэх"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
