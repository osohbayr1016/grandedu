interface UniversitySectionProps {
  title: string;
  description: string;
  adminNote?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  showAdminNote?: boolean;
}

export default function UniversitySection({
  title,
  description,
  adminNote,
  icon,
  iconBgColor,
  iconColor,
  showAdminNote = false,
}: UniversitySectionProps) {
  return (
    <section className="mb-12">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <div
            className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center mr-4`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
          {title}
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-600">{description}</p>
          {/* Admin-only note */}
          {showAdminNote && adminNote && adminNote.trim() && (
            <div className="mt-4 mx-auto max-w-md">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Админы тэмдэглэл
                    </p>
                    <p className="text-sm text-amber-700 mt-1">{adminNote}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
