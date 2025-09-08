"use client";

import { useState } from "react";

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

interface FooterEditorProps {
  footerContent: FooterContent;
  onContentChange: (field: string, value: string) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  hasChanges: boolean;
}

export default function FooterEditor({
  footerContent,
  onContentChange,
  onSave,
  saving,
  hasChanges,
}: FooterEditorProps) {
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
    type: "text" | "textarea" | "email" | "url" = "text",
    rows?: number
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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Footer контент засварлах
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Компанийн мэдээлэл
            </h3>
            {renderEditableField(
              "companyDescription",
              "Компанийн тайлбар",
              footerContent.companyDescription,
              "textarea"
            )}
            {renderEditableField(
              "address",
              "Хаяг",
              footerContent.address,
              "textarea"
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Холбоо барих мэдээлэл
            </h3>
            {renderEditableField("phone", "Утас", footerContent.phone)}
            {renderEditableField(
              "email",
              "Имэйл",
              footerContent.email,
              "email"
            )}
            {renderEditableField(
              "copyright",
              "Copyright текст",
              footerContent.copyright
            )}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Сошиал медиа холбоосууд
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderEditableField(
              "facebook",
              "Facebook URL",
              footerContent.facebook,
              "url"
            )}
            {renderEditableField(
              "instagram",
              "Instagram URL",
              footerContent.instagram,
              "url"
            )}
            {renderEditableField(
              "youtube",
              "YouTube URL",
              footerContent.youtube,
              "url"
            )}
            {renderEditableField(
              "privacyPolicy",
              "Privacy Policy URL",
              footerContent.privacyPolicy,
              "url"
            )}
            {renderEditableField(
              "termsOfService",
              "Terms of Service URL",
              footerContent.termsOfService,
              "url"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
