"use client";

import { useState } from "react";

interface GroupedContent {
  [section: string]: {
    [field: string]: string;
  };
}

interface ContentEditorProps {
  groupedContent: GroupedContent;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onContentChange: (section: string, field: string, value: string) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}

export default function ContentEditor({
  groupedContent,
  activeSection,
  onSectionChange,
  onContentChange,
  onSave,
  saving,
}: ContentEditorProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const sections = [
    { key: "hero", label: "Hero хэсэг", icon: "🏠" },
    { key: "about", label: "Бидний тухай", icon: "ℹ️" },
    { key: "programs", label: "Хөтөлбөрүүд", icon: "📚" },
    { key: "universities", label: "Их сургуулиуд", icon: "🎓" },
    { key: "news", label: "Мэдээ", icon: "📰" },
    { key: "contact", label: "Холбоо барих", icon: "📞" },
  ];

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleSave = async () => {
    if (!editingField) return;
    onContentChange(activeSection, editingField, editValue);
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
    type: "text" | "textarea" = "text"
  ) => {
    const isEditing = editingField === field;

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        {isEditing ? (
          <div className="space-y-2">
            {type === "textarea" ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={4}
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
                <p className="text-gray-900 whitespace-pre-wrap">{value}</p>
              ) : (
                <p className="text-gray-900">{value}</p>
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
        <h2 className="text-xl font-semibold text-gray-900">
          Контент засварлах
        </h2>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200">
          <nav className="p-4 space-y-2">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => onSectionChange(section.key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.key
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {groupedContent[activeSection] ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {sections.find((s) => s.key === activeSection)?.label}
              </h3>
              {Object.entries(groupedContent[activeSection]).map(
                ([field, value]) => (
                  <div key={field}>
                    {renderEditableField(
                      field,
                      field.charAt(0).toUpperCase() + field.slice(1),
                      value,
                      field.includes("description") || field.includes("content")
                        ? "textarea"
                        : "text"
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Энэ хэсэгт контент байхгүй байна.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
