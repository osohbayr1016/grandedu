"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { getUniversitiesUrl, getContentUrl } from "@/utils/api";
import UniversityHero from "@/components/UniversityHero";
import UniversityDescription from "@/components/UniversityDescription";
import UniversityOverview from "@/components/UniversityOverview";
import UniversitySection from "@/components/UniversitySection";
import UniversityContact from "@/components/UniversityContact";

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

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, showAuth, setShowAuth, isLogin, setIsLogin } = useAuth();
  const [university, setUniversity] = useState<University | null>(null);
  const [universitySectionContent, setUniversitySectionContent] = useState({
    programsTitle: "Хөтөлбөрүүд",
    programsDescription: "Хөтөлбөрийн дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.",
    programsAdminNote: "",
    admissionRequirementsTitle: "Элсэлтийн шаардлага",
    admissionRequirementsDescription:
      "Элсэлтийн шаардлагын дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.",
    cityLifeTitle: "Хотын амьдрал",
    cityLifeDescription:
      "Хотын амьдралын дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.",
  });

  useEffect(() => {
    fetchUniversity();
  }, [params.id, router]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load university-specific content when university is loaded
  useEffect(() => {
    if (university?.id) {
      loadUniversitySectionContentLocal(university.id);
    }
  }, [university?.id]);

  const loadUniversitySectionContentLocal = async (universityId: string) => {
    try {
      const response = await fetch(
        `${getContentUrl()}/university-sections/${universityId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Start with defaults
        const defaultContent = {
          programsTitle: "Хөтөлбөрүүд",
          programsDescription:
            "Хөтөлбөрийн дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.",
          programsAdminNote: "",
          admissionRequirementsTitle: "Элсэлтийн шаардлага",
          admissionRequirementsDescription:
            "Элсэлтийн шаардлагын дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.",
          cityLifeTitle: "Хотын амьдрал",
          cityLifeDescription:
            "Хотын амьдралын дэлгэрэнгүй мэдээлэл удахгүй нэмэгдэнэ.",
        };

        const contentToSet = { ...defaultContent };

        // Override with any saved content
        if (
          data.universitySections &&
          typeof data.universitySections === "object"
        ) {
          Object.keys(defaultContent).forEach((key) => {
            if (data.universitySections[key]) {
              contentToSet[key as keyof typeof defaultContent] =
                data.universitySections[key];
            }
          });
        }

        setUniversitySectionContent(contentToSet);
      }
    } catch (error) {
      console.warn("Error loading university section content:", error);
      // Keep defaults on error
    }
  };

  const fetchUniversity = async () => {
    try {
      const universityId = params.id as string;
      const response = await fetch(`${getUniversitiesUrl()}/${universityId}`);

      if (response.ok) {
        const data = await response.json();
        setUniversity(data);
      } else {
        console.error("Failed to fetch university");
        router.push("/universities");
      }
    } catch (error) {
      console.error("Error fetching university:", error);
      router.push("/universities");
    }
  };

  if (!university) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <UniversityHero university={university} />

      {/* Main Content */}
      <main className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <UniversityDescription university={university} />
            <UniversityOverview university={university} />

            <UniversitySection
              title={universitySectionContent.programsTitle}
              description={universitySectionContent.programsDescription}
              adminNote={universitySectionContent.programsAdminNote}
              icon={
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              }
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              showAdminNote={user?.role === "admin"}
            />

            <UniversitySection
              title={universitySectionContent.admissionRequirementsTitle}
              description={
                universitySectionContent.admissionRequirementsDescription
              }
              icon={
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              iconBgColor="bg-orange-100"
              iconColor="text-orange-600"
            />

            <UniversitySection
              title={universitySectionContent.cityLifeTitle}
              description={universitySectionContent.cityLifeDescription}
              icon={
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
              iconBgColor="bg-red-100"
              iconColor="text-red-600"
            />

            <UniversityContact />
          </div>
        </div>
      </main>

      {/* Authentication Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="relative animate-scale-in">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
            {isLogin ? (
              <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
              <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
