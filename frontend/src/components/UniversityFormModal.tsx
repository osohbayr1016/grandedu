"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";

interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  adminNote?: string;
}

interface UniversityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (university: Partial<University>) => Promise<void>;
  editingUniversity: University | null;
  saving: boolean;
}

export default function UniversityFormModal({
  isOpen,
  onClose,
  onSave,
  editingUniversity,
  saving,
}: UniversityFormModalProps) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
    adminNote: "",
  });

  useEffect(() => {
    if (editingUniversity) {
      setForm({
        name: editingUniversity.name,
        location: editingUniversity.location,
        description: editingUniversity.description,
        imageUrl: editingUniversity.imageUrl || "",
        adminNote: editingUniversity.adminNote || "",
      });
    } else {
      setForm({
        name: "",
        location: "",
        description: "",
        imageUrl: "",
        adminNote: "",
      });
    }
  }, [editingUniversity, isOpen]);

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
      title={editingUniversity ? "Их сургууль засах" : "Шинэ их сургууль нэмэх"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Их сургуулийн нэр *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Байршил *
            </label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тайлбар *
          </label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
            Админы тэмдэглэл
            <span className="text-xs text-gray-500 ml-1">
              (зөвхөн админд харагдана)
            </span>
          </label>
          <textarea
            rows={3}
            value={form.adminNote}
            onChange={(e) => handleChange("adminNote", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Их сургуулийн тухай нэмэлт мэдээлэл..."
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
            {saving
              ? "Хадгалж байна..."
              : editingUniversity
              ? "Хадгалах"
              : "Нэмэх"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
