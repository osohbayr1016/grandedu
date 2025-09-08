"use client";

interface UniversitySectionContentProps {
  content: {
    programsTitle: string;
    programsDescription: string;
    programsAdminNote: string;
    admissionRequirementsTitle: string;
    admissionRequirementsDescription: string;
    cityLifeTitle: string;
    cityLifeDescription: string;
  };
  onContentChange: (field: string, value: string) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  hasChanges: boolean;
}

export default function UniversitySectionContent({
  content,
  onContentChange,
  onSave,
  saving,
  hasChanges,
}: UniversitySectionContentProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Хэсгүүдийн контент
          </h2>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Programs Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Хөтөлбөрүүд хэсэг
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Гарчиг
            </label>
            <input
              type="text"
              value={content.programsTitle}
              onChange={(e) => onContentChange("programsTitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тайлбар
            </label>
            <textarea
              value={content.programsDescription}
              onChange={(e) =>
                onContentChange("programsDescription", e.target.value)
              }
              rows={3}
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
              value={content.programsAdminNote}
              onChange={(e) =>
                onContentChange("programsAdminNote", e.target.value)
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Хөтөлбөрийн төрөл, тэмдэглэл..."
            />
          </div>
        </div>

        {/* Admission Requirements Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Элсэлтийн шаардлага хэсэг
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Гарчиг
            </label>
            <input
              type="text"
              value={content.admissionRequirementsTitle}
              onChange={(e) =>
                onContentChange("admissionRequirementsTitle", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тайлбар
            </label>
            <textarea
              value={content.admissionRequirementsDescription}
              onChange={(e) =>
                onContentChange(
                  "admissionRequirementsDescription",
                  e.target.value
                )
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* City Life Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Хотын амьдрал хэсэг
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Гарчиг
            </label>
            <input
              type="text"
              value={content.cityLifeTitle}
              onChange={(e) => onContentChange("cityLifeTitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тайлбар
            </label>
            <textarea
              value={content.cityLifeDescription}
              onChange={(e) =>
                onContentChange("cityLifeDescription", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
