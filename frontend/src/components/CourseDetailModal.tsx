"use client";

import { Course, CourseRegistration } from "@/types";
import Modal from "@/components/Modal";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";
import Image from "next/image";

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export default function CourseDetailModal({
  isOpen,
  onClose,
  course,
}: CourseDetailModalProps) {
  const { user, setShowAuth, setIsLogin } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [notes, setNotes] = useState("");

  const checkIfRegistered = useCallback(async () => {
    if (!course || !user) return;

    try {
      const token = localStorage.getItem("token");
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/registrations/my-registrations`,
        {},
        token!
      );

      if (response.ok) {
        const registrations: CourseRegistration[] = await response.json();
        const registered = registrations.some((r) => r.courseId === course.id);
        setIsRegistered(registered);
      }
    } catch (error) {
      console.error("Error checking registration:", error);
    }
  }, [course, user]);

  const checkIfSaved = useCallback(async () => {
    if (!course || !user) return;

    try {
      const token = localStorage.getItem("token");
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/saved-courses/check/${course.id}`,
        {},
        token!
      );

      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.isSaved);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  }, [course, user]);

  useEffect(() => {
    if (course && user) {
      checkIfSaved();
      checkIfRegistered();
    }
  }, [course, user, checkIfSaved, checkIfRegistered]);

  const handleToggleSave = async () => {
    if (!course || !user) {
      alert("Сургалт хадгалахын тулд эхлээд нэвтэрнэ үү.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      if (isSaved) {
        // Unsave
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/saved-courses/${course.id}`,
          {
            method: "DELETE",
          },
          token!
        );

        if (response.ok) {
          setIsSaved(false);
        } else {
          alert("Алдаа гарлаа. Дахин оролдоно уу.");
        }
      } else {
        // Save
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/saved-courses`,
          {
            method: "POST",
            body: JSON.stringify({ courseId: course.id }),
          },
          token!
        );

        if (response.ok) {
          setIsSaved(true);
        } else {
          alert("Алдаа гарлаа. Дахин оролдоно уу.");
        }
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setSaving(false);
    }
  };

  if (!course) return null;

  const handleRegister = async () => {
    if (!user) {
      alert("Бүртгүүлэхийн тулд эхлээд нэвтэрнэ үү.");
      onClose();
      setIsLogin(false); // Set to signup mode
      setShowAuth(true);
      return;
    }

    if (isRegistered) {
      alert(
        "Та энэ сургалтад аль хэдийн бүртгүүлсэн байна. Профайл хуудсаа шалгана уу."
      );
      return;
    }

    // If there's a registration link, use both: create DB record AND open form
    if (!showNotesInput && notes === "") {
      setShowNotesInput(true);
      return;
    }

    setRegistering(true);
    try {
      const token = localStorage.getItem("token");
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/registrations`,
        {
          method: "POST",
          body: JSON.stringify({
            courseId: course.id,
            notes: notes || null,
          }),
        },
        token!
      );

      if (response.ok) {
        setIsRegistered(true);
        alert("Амжилттай бүртгэгдлээ! Админ тань удахгүй холбогдох болно.");

        // If external registration link exists, open it too
        if (course.registrationLink) {
          window.open(course.registrationLink, "_blank", "noopener,noreferrer");
        }

        onClose();
      } else {
        const errorData = await response.json();
        alert(
          errorData.message || "Бүртгүүлэхэд алдаа гарлаа. Дахин оролдоно уу."
        );
      }
    } catch (error) {
      console.error("Error registering for course:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={course.title} size="lg">
      <div className="space-y-6">
        {/* Course Image */}
        {course.imageUrl && (
          <div className="w-full h-48 sm:h-64 relative rounded-lg overflow-hidden">
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
        )}

        {/* Course Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Хугацаа</div>
            <div className="text-sm font-semibold text-gray-900">
              {course.duration}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Түвшин</div>
            <div className="text-sm font-semibold text-gray-900">
              {course.level}
            </div>
          </div>
          {course.price && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Үнэ</div>
              <div className="text-sm font-semibold text-gray-900">
                {course.price}
              </div>
            </div>
          )}
          {course.instructor && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Багш</div>
              <div className="text-sm font-semibold text-gray-900">
                {course.instructor}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Тайлбар</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {course.description}
          </p>
        </div>

        {/* Schedule */}
        {course.schedule && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Хуваарь
            </h3>
            <p className="text-gray-700">{course.schedule}</p>
          </div>
        )}

        {/* Requirements */}
        {course.requirements && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Шаардлага
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {course.requirements}
            </p>
          </div>
        )}

        {/* Registration Notes (shows when registering) */}
        {showNotesInput && user && !isRegistered && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тэмдэглэл (заавал биш)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Асуулт эсвэл тэмдэглэл байвал энд бичнэ үү..."
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Хаах
            </button>
            {user && (
              <button
                onClick={handleToggleSave}
                disabled={saving}
                className={`px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  isSaved
                    ? "bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100 focus:ring-yellow-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-gray-500"
                }`}
              >
                {saving ? "..." : isSaved ? <>⭐ Хадгалсан</> : <>☆ Хадгалах</>}
              </button>
            )}
          </div>
          <button
            onClick={handleRegister}
            disabled={registering || (isRegistered && !!user)}
            className={`px-6 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isRegistered && user
                ? "bg-green-600 text-white cursor-not-allowed"
                : "text-white bg-blue-600 hover:bg-blue-700"
            } disabled:opacity-70`}
          >
            {registering
              ? "Бүртгэж байна..."
              : isRegistered && user
              ? "✓ Бүртгүүлсэн"
              : showNotesInput
              ? "Бүртгэл баталгаажуулах →"
              : "Бүртгүүлэх →"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
