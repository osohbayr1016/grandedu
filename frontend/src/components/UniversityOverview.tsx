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

interface UniversityOverviewProps {
  university: University;
}

export default function UniversityOverview({
  university,
}: UniversityOverviewProps) {
  return (
    <section className="mb-12">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
            </svg>
          </div>
          Их сургуулийн ерөнхий мэдээлэл
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Байршил
            </h3>
            <p className="text-gray-600">{university.location}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Үүсгэсэн огноо
            </h3>
            <p className="text-gray-600">
              {new Date(university.createdAt).toLocaleDateString("mn-MN")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
