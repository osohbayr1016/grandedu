"use client";

import { useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";

interface ContentItem {
  id: string;
  page: string;
  section: string;
  field: string;
  content: string;
  type: string;
}

interface PageEditorProps {
  content: ContentItem[];
  onUpdate: (
    field: string,
    value: string,
    section: string,
    page: string
  ) => void;
}

export default function AdminPageEditor({
  content,
  onUpdate,
}: PageEditorProps) {
  const pages = ["home", "programs", "universities", "news", "footer"];
  const [selectedPage, setSelectedPage] = useState("home");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const pageContent = content.filter((item) => item.page === selectedPage);

  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingField) {
      const contentItem = pageContent.find(
        (item) => item.field === editingField
      );
      onUpdate(
        editingField,
        editValue,
        contentItem?.section || "general",
        selectedPage
      );
      setEditingField(null);
      setEditValue("");
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Хуудасны контент засах
        </h2>
        <p className="text-gray-600 mt-2">
          Веб сайтын бүх хуудасны контентыг эндээс засна уу.
        </p>
      </div>

      {/* Page Selection */}
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Хуудас сонгох:
        </label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs"
        >
          {pages.map((page) => (
            <option key={page} value={page}>
              {page === "home"
                ? "Үндсэн хуудас"
                : page === "programs"
                ? "Хөтөлбөрүүд"
                : page === "universities"
                ? "Их Сургуулиуд"
                : page === "news"
                ? "Мэдээ"
                : page === "footer"
                ? "Footer"
                : page}
            </option>
          ))}
        </select>
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {selectedPage === "home"
              ? "Үндсэн хуудасны контент"
              : selectedPage === "programs"
              ? "Хөтөлбөрүүдийн хуудасны контент"
              : selectedPage === "universities"
              ? "Их Сургуулиудын хуудасны контент"
              : selectedPage === "news"
              ? "Мэдээний хуудасны контент"
              : selectedPage === "footer"
              ? "Footer контент"
              : "Контент"}
          </h3>
        </div>

        <div className="p-6 space-y-4">
          {pageContent.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Энэ хуудасны контент олдсонгүй.
            </p>
          ) : (
            pageContent.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {item.field}
                    </label>
                    <p className="text-xs text-gray-500">{item.section}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(item.field, item.content)}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                    >
                      Засах
                    </button>
                  </div>
                </div>

                {editingField === item.field ? (
                  <div className="space-y-2">
                    <RichTextEditor
                      value={editValue}
                      onChange={setEditValue}
                      placeholder={`${item.field} контентыг энд бичнэ үү...`}
                      rows={6}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={saveEdit}
                        className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Хадгалах
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded"
                      >
                        Цуцлах
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded min-h-[100px]">
                    {item.content || "Хоосон байна..."}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
