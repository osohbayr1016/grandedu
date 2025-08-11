"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  programs: string[];
  facilities: string[];
  admissionRequirements: string[];
  cityLife: string[];
}

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);

  // Sample university data
  const universitiesData: University[] = [
    {
      id: "1",
      name: "Сычуань их сургууль",
      location: "Чэнду, Сычуань",
      description: "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг",
      imageUrl: "https://example.com/sichuan.jpg",
      programs: [
        "Бакалаврын хөтөлбөр - 4 жил",
        "Магистрын хөтөлбөр - 2 жил",
        "Докторын хөтөлбөр - 3-4 жил",
      ],
      facilities: [
        "Орчин үеийн сургалтын танхимууд",
        "Номын сан",
        "Спорт заал",
        "Оюутны дотуур байр",
        "Цахим сургалтын систем",
      ],
      admissionRequirements: [
        "12 жилийн боловсрол",
        "IELTS 6.0 эсвэл TOEFL 80+",
        "Хятад хэлний HSK 4+",
        "Академик дундаж 3.0+",
        "Урьдчилсан мэдлэг",
      ],
      cityLife: [
        "Чэнду - Хятадын 4-р том хот",
        "Хятадын байгаль, соёлын төв",
        "Хоолны соёл, технологийн хөгжил",
        "Олон улсын компаниудын төв",
        "Аялал жуулчлалын хөгжлийн",
      ],
    },
    {
      id: "2",
      name: "Хятадын Шинжлэх Ухаан, Технологийн Их Сургууль",
      location: "Хэфэй, Аньхой",
      description: "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг",
      imageUrl: "https://example.com/ustc.jpg",
      programs: [
        "Инженерийн хөтөлбөрүүд",
        "Шинжлэх ухааны хөтөлбөрүүд",
        "Технологийн хөтөлбөрүүд",
      ],
      facilities: [
        "Дэлгэрэнгүй лабораториуд",
        "Судалгааны төвүүд",
        "Олон улсын хамтын ажиллагаа",
        "Инновацийн парк",
      ],
      admissionRequirements: [
        "Математик, физикийн сайн мэдлэг",
        "Англи хэлний түвшин",
        "Хятад хэлний мэдлэг",
        "Академик хөгжил",
      ],
      cityLife: [
        "Хэфэй - Аньхой мужийн төв",
        "Технологийн хөгжлийн хот",
        "Байгаль орчны цэвэр",
        "Хятадын соёлын төв",
      ],
    },
    {
      id: "3",
      name: "Шанхайн Жяо Тонгийн Их Сургууль",
      location: "Шанхай",
      description: "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг",
      imageUrl: "https://example.com/sjtu.jpg",
      programs: [
        "Бизнес удирдлага",
        "Инженерийн чиглэлүүд",
        "Хууль эрх зүй",
        "Хэл, соёл",
      ],
      facilities: [
        "Олон улсын стандартын сургалт",
        "Бизнес инкубатор",
        "Хэлний сургалтын төв",
        "Оюутны үйл ажиллагааны төв",
      ],
      admissionRequirements: [
        "Англи хэлний түвшин",
        "Хятад хэлний мэдлэг",
        "Академик дундаж",
        "Хувийн мэдээлэл",
      ],
      cityLife: [
        "Шанхай - Хятадын хамгийн том хот",
        "Олон улсын санхүүгийн төв",
        "Худалдаа, үйлдвэрлэлийн төв",
        "Олон улсын соёлын хөгжил",
      ],
    },
  ];

  useEffect(() => {
    const universityId = params.id as string;
    const foundUniversity = universitiesData.find(
      (uni) => uni.id === universityId
    );
    if (foundUniversity) {
      setUniversity(foundUniversity);
    } else {
      router.push("/universities");
    }
  }, [params.id, router]);

  if (!university) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Header Design */}
      <div className="relative bg-white shadow-lg overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute top-1/2 right-0 w-48 h-48 bg-purple-600 rounded-full translate-x-24 -translate-y-24"></div>
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-indigo-600 rounded-full translate-y-16"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <button
                onClick={() => router.push("/universities")}
                className="mr-4 p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <svg
                className="w-4 h-4 mr-2"
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
              Их сургууль
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              {university.name}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-2">
              {university.location}
            </p>
            <p className="text-base text-gray-600">{university.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* University Overview */}
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
                      Тайлбар
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {university.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Байршил
                    </h3>
                    <p className="text-gray-600">{university.location}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Programs Section */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-green-600"
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
                  Хөтөлбөрүүд
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {university.programs.map((program, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-800 font-medium">
                          {program}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Facilities Section */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  Суурь талбай, тоног төхөөрөмж
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {university.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-3 h-3 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Admission Requirements Section */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  Элсэлтийн шаардлага
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {university.admissionRequirements.map(
                    (requirement, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-3 h-3 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>

            {/* City Life Section */}
            <section className="mb-12">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  Хотын амьдрал
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {university.cityLife.map((life, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-3 h-3 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{life}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Холбоо барих</h2>
                <p className="text-blue-50 mb-6">
                  Энэ их сургуулийн талаар дэлгэрэнгүй мэдэхийг хүсвэл бидэнтэй
                  холбогдоно уу.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Дэлгэрэнгүй мэдээлэл
                  </button>
                  <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                    Холбоо барих
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
