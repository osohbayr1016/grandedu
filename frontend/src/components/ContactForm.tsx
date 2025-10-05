"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getApiBaseUrl } from "@/utils/api";

const schema = yup
  .object({
    name: yup
      .string()
      .required("Нэр заавал оруулна уу")
      .min(2, "Нэр хамгийн багадаа 2 тэмдэгт байх ёстой")
      .max(50, "Нэр хамгийн ихдээ 50 тэмдэгт байх ёстой"),
    email: yup
      .string()
      .required("Имэйл хаяг заавал оруулна уу")
      .email("Хүчинтэй имэйл хаяг оруулна уу"),
    phone: yup
      .string()
      .required("Утасны дугаар заавал оруулна уу")
      .matches(
        /^(\+976|976)?\s?[0-9\s]{8,}$/,
        "Зөв утасны дугаар оруулна уу (жишээ: +976 9999 9999 эсвэл 9999 9999)"
      ),
    subject: yup
      .string()
      .required("Гарчиг заавал оруулна уу")
      .min(5, "Гарчиг хамгийн багадаа 5 тэмдэгт байх ёстой")
      .max(100, "Гарчиг хамгийн ихдээ 100 тэмдэгт байх ёстой"),
    message: yup
      .string()
      .required("Мессеж заавал оруулна уу")
      .min(10, "Мессеж хамгийн багадаа 10 тэмдэгт байх ёстой")
      .max(1000, "Мессеж хамгийн ихдээ 1000 тэмдэгт байх ёстой"),
    inquiryType: yup
      .string()
      .required("Хүсэлтийн төрөл сонгоно уу")
      .oneOf(
        ["general", "admission", "programs", "universities", "other"],
        "Хүчингүй сонголт"
      ),
  })
  .required();

type ContactFormData = yup.InferType<typeof schema>;

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: `${data.subject}\n\n${data.message}`,
        }),
      });

      if (response.ok) {
        console.log("Contact form data:", data);
        setIsSubmitted(true);
        reset();
      } else {
        throw new Error("Failed to submit contact form");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Мессеж илгээх үед алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
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

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Мессеж амжилттай илгээгдлээ! 📧
        </h2>

        <p className="text-gray-600 mb-6">
          Таны мессежийг хүлээн авлаа. Хамгийн ойрын хугацаанд холбогдох болно.
        </p>

        <button
          onClick={() => setIsSubmitted(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Шинэ мессеж илгээх
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Холбоо барих</h2>

        <p className="text-gray-600">
          Асуулт, санал хүсэлт байвал бидэнтэй холбогдоно уу
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Нэр *
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Таны нэр"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Имэйл хаяг *
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Утасны дугаар *
            </label>
            <input
              {...register("phone")}
              type="tel"
              id="phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+976 9999 9999"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="inquiryType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Хүсэлтийн төрөл *
            </label>
            <select
              {...register("inquiryType")}
              id="inquiryType"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="">Сонгоно уу</option>
              <option value="general">Ерөнхий асуулт</option>
              <option value="admission">Элсэлт</option>
              <option value="programs">Хөтөлбөрүүд</option>
              <option value="universities">Их сургуулиуд</option>
              <option value="other">Бусад</option>
            </select>
            {errors.inquiryType && (
              <p className="mt-2 text-sm text-red-600">
                {errors.inquiryType.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Гарчиг *
          </label>
          <input
            {...register("subject")}
            type="text"
            id="subject"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Таны хүсэлтийн гарчиг"
            disabled={isLoading}
          />
          {errors.subject && (
            <p className="mt-2 text-sm text-red-600">
              {errors.subject.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Мессеж *
          </label>
          <textarea
            {...register("message")}
            id="message"
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Таны мессежийг энд бичнэ үү..."
            disabled={isLoading}
          />
          {errors.message && (
            <p className="mt-2 text-sm text-red-600">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Илгээж байна...</span>
            </>
          ) : (
            <span>Мессеж илгээх</span>
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Имэйл</h3>
            <p className="text-sm text-gray-600">info@grandedu.mn</p>
          </div>

          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Утас</h3>
            <p className="text-sm text-gray-600">+976 9999 9999</p>
          </div>

          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
            <h3 className="font-semibold text-gray-900 mb-1">Хаяг</h3>
            <p className="text-sm text-gray-600">Улаанбаатар хот</p>
          </div>
        </div>
      </div>
    </div>
  );
}
