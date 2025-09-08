"use client";

import { useState } from "react";

interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UniversityFormProps {
  university: University;
  onSave: (field: string, value: string) => Promise<void>;
  saving: boolean;
}

export default function UniversityForm({
  university,
  onSave,
  saving,
}: UniversityFormProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleSave = async () => {
    if (!editingField) return;
    await onSave(editingField, editValue);
    setEditingField(null);
    setEditValue("");
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const renderEditableField = (
    field: string,
    label: string,
    value: string,
    type: "text" | "url" | "textarea" = "text",
    rows?: number
  ) => {
    const isEditing = editingField === field;

    return (
      <div className={type === "textarea" ? "md:col-span-2" : ""}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        {isEditing ? (
          <div className="space-y-2">
            {type === "textarea" ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={rows || 3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <input
                type={type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
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
          <div
            className={`flex justify-between items-${
              type === "textarea" ? "start" : "center"
            }`}
          >
            <p
              className={`text-gray-900 ${type === "textarea" ? "flex-1" : ""}`}
            >
              {value}
            </p>
            <button
              onClick={() => startEditing(field, value)}
              className={`text-blue-600 hover:text-blue-700 text-sm ${
                type === "textarea" ? "ml-4" : ""
              }`}
            >
              Засах
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Үндсэн мэдээлэл</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderEditableField("name", "Их сургуулийн нэр", university.name)}
        {renderEditableField("location", "Байршил", university.location)}
        {renderEditableField(
          "description",
          "Тайлбар",
          university.description,
          "textarea"
        )}
        {renderEditableField(
          "imageUrl",
          "Зургийн URL",
          university.imageUrl,
          "url"
        )}
      </div>
    </div>
  );
}
