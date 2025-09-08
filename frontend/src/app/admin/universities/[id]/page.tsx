"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useUniversity } from "@/contexts/UniversityContext";
import { getUniversitiesUrl, getContentUrl } from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopBar from "@/components/AdminTopBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import UniversityHeader from "@/components/UniversityHeader";
import UniversityForm from "@/components/UniversityForm";
import UniversitySectionContent from "@/components/UniversitySectionContent";
import AdditionalInfo from "@/components/AdditionalInfo";

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

export default function AdminUniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    universitySectionContent,
    loadUniversitySectionContent,
    updateUniversitySectionContent,
  } = useUniversity();
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [universitySectionSaving, setUniversitySectionSaving] = useState(false);
  const [universitySectionHasChanges, setUniversitySectionHasChanges] =
    useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchUniversity();
  }, [params.id, router, user, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load university section content when university is loaded
  useEffect(() => {
    if (university?.id) {
      loadUniversitySectionContent(university.id);
    }
  }, [university?.id]);

  const fetchUniversity = async () => {
    try {
      const universityId = params.id as string;
      const response = await fetch(`${getUniversitiesUrl()}/${universityId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUniversity(data);
      } else {
        console.error("Failed to fetch university");
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error fetching university:", error);
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field: string, value: string) => {
    if (!university) return;

    setSaving(true);
    try {
      const response = await fetch(`${getUniversitiesUrl()}/${university.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...university,
          [field]: value,
        }),
      });

      if (response.ok) {
        const updatedUniversity = await response.json();
        setUniversity(updatedUniversity);
      } else {
        console.error("Failed to update university");
        alert("Хадгалахад алдаа гарлаа");
      }
    } catch (error) {
      console.error("Хадгалахад алдаа гарлаа:", error);
      alert("Хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  // University section content handlers
  const handleUniversitySectionContentChange = (
    field: string,
    value: string
  ) => {
    updateUniversitySectionContent({
      [field]: value,
    });
    setUniversitySectionHasChanges(true);
  };

  const handleSaveUniversitySection = async () => {
    if (!university?.id) {
      alert("Их сургуулийн мэдээлэл олдсонгүй!");
      return;
    }

    try {
      setUniversitySectionSaving(true);

      const response = await fetch(
        `${getContentUrl()}/university-sections/${university.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(universitySectionContent),
        }
      );

      if (response.ok) {
        setUniversitySectionHasChanges(false);
        alert("Их сургуулийн хэсгийн мэдээлэл амжилттай хадгалагдлаа!");
      } else {
        throw new Error("Failed to save university section content");
      }
    } catch (error) {
      console.error("Error saving university section content:", error);
      alert(
        "Их сургуулийн хэсгийн мэдээлэл хадгалахад алдаа гарлаа: " +
          (error as Error).message
      );
    } finally {
      setUniversitySectionSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!university) return;

    try {
      const response = await fetch(
        `${getUniversitiesUrl()}/${university.id}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const updatedUniversity = await response.json();
        setUniversity(updatedUniversity);
      } else {
        console.error("Failed to toggle university status");
        alert("Төлөв өөрчлөхөд алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Төлөв өөрчлөхөд алдаа гарлаа");
    }
  };

  if (loading) {
    return <LoadingSpinner message="Их сургуулийн мэдээлэл ачаалж байна" />;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Их сургууль олдсонгүй</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AdminTopBar />

      <div className="flex max-w-7xl mx-auto">
        <AdminSidebar currentPage="universities" />

        {/* Enhanced Main Content */}
        <div className="flex-1 p-8 max-w-5xl">
          {/* Enhanced Header with Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { label: "Админ самбар", href: "/admin" },
                { label: "Их сургуулиуд" },
                { label: university.name },
              ]}
            />

            <UniversityHeader
              university={university}
              onToggleStatus={handleToggleStatus}
            />
          </div>

          <UniversityForm
            university={university}
            onSave={handleSave}
            saving={saving}
          />

          <UniversitySectionContent
            content={universitySectionContent}
            onContentChange={handleUniversitySectionContentChange}
            onSave={handleSaveUniversitySection}
            saving={universitySectionSaving}
            hasChanges={universitySectionHasChanges}
          />

          <AdditionalInfo university={university} />
        </div>
      </div>
    </div>
  );
}
