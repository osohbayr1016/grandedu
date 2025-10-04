"use client";

import { EntityStats } from "@/types";

interface DashboardOverviewProps {
  entities: EntityStats;
}

export default function AdminDashboard({ entities }: DashboardOverviewProps) {
  const stats = [
    { name: "Их Сургуулиуд", value: entities.universities.length, icon: "🎓" },
    { name: "Хөтөлбөрүүд", value: entities.programs.length, icon: "📚" },
    { name: "Мэдээ", value: entities.news.length, icon: "📰" },
    { name: "Хэрэглэгчид", value: entities.users.length, icon: "👥" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Тавтай морилно уу!</h2>
        <p className="text-gray-600 mt-2">Энэ сайтаа удирдах самбар юм.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl mr-3">{stat.icon}</div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Шуурхай үйлдлүүд</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left">
            <div className="font-medium text-blue-900">Их сургууль нэмэх</div>
            <div className="text-sm text-blue-600">
              Шинэ их сургуулийн мэдээлэл нэмэх
            </div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left">
            <div className="font-medium text-green-900">Хөтөлбөр нэмэх</div>
            <div className="text-sm text-green-600">
              Шинэ хөтөлбөрийн мэдээлэл нэмэх
            </div>
          </button>
          <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left">
            <div className="font-medium text-yellow-900">Мэдээ нийтлэх</div>
            <div className="text-sm text-yellow-600">
              Шинэ мэдээний контент нэмэх
            </div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left">
            <div className="font-medium text-purple-900">Хуудас засах</div>
            <div className="text-sm text-purple-600">
              Веб сайтын контент засах
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
