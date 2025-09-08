"use client";

import { useState } from "react";

interface UniversitySectionContent {
  programsTitle: string;
  programsDescription: string;
  programsAdminNote: string;
  admissionRequirementsTitle: string;
  admissionRequirementsDescription: string;
  cityLifeTitle: string;
  cityLifeDescription: string;
}

interface UniversityContentEditorProps {
  content: UniversitySectionContent;
  onContentChange: (field: string, value: string) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  hasChanges: boolean;
  selectedUniversity: string;
  onUniversityChange: (universityId: string) => void;
  universities: Array<{ id: string; name: string }>;
}

export default function UniversityContentEditor({
  content,
  onContentChange,
  onSave,
  saving,
  hasChanges,
  selectedUniversity,
  onUniversityChange,
  universities,
}: UniversityContentEditorProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleSave = async () => {
    if (!editingField) return;
    onContentChange(editingField, editValue);
    setEditingField(null);
    setEditValue("");
    await onSave();
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const renderEditableField = (
    field: string,
    label: string,
    value: string,
    type: "text" | "textarea" = "text",
    rows?: number
  ) => {
    const isEditing = editingField === field;

    return (
      <div className="mb-4">
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
                type="text"
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
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {type === "textarea" ? (
                <p className="text-gray-900 whitespace-pre-wrap text-sm">
                  {value}
                </p>
              ) : (
                <p className="text-gray-900 text-sm">{value}</p>
              )}
            </div>
            <button
              onClick={() => startEditing(field, value)}
              className="text-blue-600 hover:text-blue-700 text-sm ml-4"
            >
              Засах
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Их сургуулийн хэсгүүдийн контент
          </h2>
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <span className="text-sm text-orange-600 font-medium">
                Хадгалаагүй өөрчлөлт байна
              </span>
            )}
            <button
              onClick={onSave}
              disabled={saving}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                hasChanges
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              <span>{saving ? "Хадгалж байна..." : "Хадгалах"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* University Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Их сургууль сонгох
          </label>
          <select
            value={selectedUniversity}
            onChange={(e) => onUniversityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Их сургууль сонгох</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
        </div>

        {selectedUniversity && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Programs Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Хөтөлбөрүүд хэсэг
              </h3>
              {renderEditableField(
                "programsTitle",
                "Гарчиг",
                content.programsTitle
              )}
              {renderEditableField(
                "programsDescription",
                "Тайлбар",
                content.programsDescription,
                "textarea"
              )}
              {renderEditableField(
                "programsAdminNote",
                "Админы тэмдэглэл",
                content.programsAdminNote,
                "textarea",
                2
              )}
            </div>

            {/* Admission Requirements Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Элсэлтийн шаардлага хэсэг
              </h3>
              {renderEditableField(
                "admissionRequirementsTitle",
                "Гарчиг",
                content.admissionRequirementsTitle
              )}
              {renderEditableField(
                "admissionRequirementsDescription",
                "Тайлбар",
                content.admissionRequirementsDescription,
                "textarea"
              )}
            </div>

            {/* City Life Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Хотын амьдрал хэсэг
              </h3>
              {renderEditableField(
                "cityLifeTitle",
                "Гарчиг",
                content.cityLifeTitle
              )}
              {renderEditableField(
                "cityLifeDescription",
                "Тайлбар",
                content.cityLifeDescription,
                "textarea"
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
