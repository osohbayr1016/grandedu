"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  imageUrl: string;
  googleFormLink: string;
  isActive: boolean;
  isHighlighted?: boolean;
  adminNote?: string;
}

interface ProgramFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: Partial<Program>) => Promise<void>;
  editingProgram: Program | null;
  saving: boolean;
}

export default function ProgramFormModal({
  isOpen,
  onClose,
  onSave,
  editingProgram,
  saving,
}: ProgramFormModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    level: "",
    imageUrl: "",
    googleFormLink: "",
    adminNote: "",
  });

  useEffect(() => {
    if (editingProgram) {
      setForm({
        title: editingProgram.title,
        description: editingProgram.description,
        duration: editingProgram.duration,
        level: editingProgram.level,
        imageUrl: editingProgram.imageUrl,
        googleFormLink: editingProgram.googleFormLink,
        adminNote: editingProgram.adminNote || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        duration: "",
        level: "",
        imageUrl: "",
        googleFormLink: "",
        adminNote: "",
      });
    }
  }, [editingProgram, isOpen]);

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
      title={editingProgram ? "Хөтөлбөр засах" : "Шинэ хөтөлбөр нэмэх"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Хөтөлбөрийн нэр *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Үргэлжлэх хугацаа *
            </label>
            <input
              type="text"
              required
              value={form.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Түвшин *
            </label>
            <select
              required
              value={form.level}
              onChange={(e) => handleChange("level", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Түвшин сонгох</option>
              <option value="бакалавр">Бакалавр</option>
              <option value="магистр">Магистр</option>
              <option value="доктор">Доктор</option>
              <option value="диплом">Диплом</option>
            </select>
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
            Google Form холбоос
          </label>
          <input
            type="url"
            value={form.googleFormLink}
            onChange={(e) => handleChange("googleFormLink", e.target.value)}
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
            placeholder="Хөтөлбөрийн тухай нэмэлт мэдээлэл..."
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
              : editingProgram
              ? "Хадгалах"
              : "Нэмэх"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
