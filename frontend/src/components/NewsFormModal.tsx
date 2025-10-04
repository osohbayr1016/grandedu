"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";

interface News {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  isActive: boolean;
}

interface NewsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (news: Partial<News>) => Promise<void>;
  editingNews: News | null;
  saving: boolean;
}

export default function NewsFormModal({
  isOpen,
  onClose,
  onSave,
  editingNews,
  saving,
}: NewsFormModalProps) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    publishDate: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (editingNews) {
      setForm({
        title: editingNews.title,
        content: editingNews.content,
        author: editingNews.author,
        publishDate: editingNews.publishDate,
        imageUrl: editingNews.imageUrl || "",
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      setForm({
        title: "",
        content: "",
        author: "",
        publishDate: today,
        imageUrl: "",
      });
    }
  }, [editingNews, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingNews ? "Мэдээ засах" : "Шинэ мэдээ нэмэх"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Мэдээний гарчиг *
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Зохиогч *
            </label>
            <input
              type="text"
              required
              value={form.author}
              onChange={(e) => handleChange("author", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Нийтлэх огноо *
            </label>
            <input
              type="date"
              required
              value={form.publishDate}
              onChange={(e) => handleChange("publishDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Зургийн URL
          </label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Мэдээний агуулга *
          </label>
          <textarea
            required
            rows={8}
            value={form.content}
            onChange={(e) => handleChange("content", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Мэдээний дэлгэрэнгүй агуулга..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Цуцлах
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Хадгалж байна..." : editingNews ? "Хадгалах" : "Нэмэх"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
