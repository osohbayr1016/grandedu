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

interface AdditionalInfoProps {
  university: University;
}

export default function AdditionalInfo({ university }: AdditionalInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Нэмэлт мэдээлэл
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Үүсгэсэн огноо
          </label>
          <p className="text-gray-900">
            {new Date(university.createdAt).toLocaleDateString("mn-MN")}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Сүүлд засварласан
          </label>
          <p className="text-gray-900">
            {new Date(university.updatedAt).toLocaleDateString("mn-MN")}
          </p>
        </div>
      </div>
    </div>
  );
}
