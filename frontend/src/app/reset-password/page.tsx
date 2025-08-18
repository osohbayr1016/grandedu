"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { getVerifyResetCodeUrl, getResetPasswordUrl } from "@/utils/api";

interface VerifyCodeForm {
  code: string;
}

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

const verifyCodeSchema = yup
  .object({
    code: yup
      .string()
      .required("Код заавал оруулна уу")
      .length(6, "Код 6 оронтой байх ёстой")
      .matches(/^\d+$/, "Код зөвхөн тоо байх ёстой"),
  })
  .required();

const resetPasswordSchema = yup
  .object({
    newPassword: yup
      .string()
      .required("Нууц үг заавал оруулна уу")
      .min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой"),
    confirmPassword: yup
      .string()
      .required("Нууц үг баталгаажуулах заавал")
      .oneOf([yup.ref("newPassword")], "Нууц үг таарахгүй байна"),
  })
  .required();

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"verify" | "reset" | "success">("verify");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerVerify,
    handleSubmit: handleSubmitVerify,
    formState: { errors: errorsVerify },
    watch: watchVerify,
  } = useForm<VerifyCodeForm>({
    resolver: yupResolver(verifyCodeSchema),
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset },
  } = useForm<ResetPasswordForm>({
    resolver: yupResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      router.push("/forgot-password");
    }
  }, [searchParams, router]);

  const onSubmitVerifyCode = async (data: VerifyCodeForm) => {
    try {
      setIsLoading(true);

      const response = await fetch(getVerifyResetCodeUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: data.code }),
      });

      const result = await response.json();

      if (response.ok) {
        setResetToken(result.resetToken);
        setStep("reset");
      } else {
        alert(result.message || "Буруу код");
      }
    } catch (error) {
      console.error("Verify code error:", error);
      alert("Серверийн алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitResetPassword = async (data: ResetPasswordForm) => {
    try {
      setIsLoading(true);

      const response = await fetch(getResetPasswordUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetToken,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStep("success");
      } else {
        alert(result.message || "Нууц үг өөрчлөхөд алдаа гарлаа");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Серверийн алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push("/");
  };

  const handleResendCode = () => {
    router.push("/forgot-password");
  };

  // Auto-format code input
  const codeValue = watchVerify("code") || "";

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
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

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Амжилттай! 🎉
            </h1>

            <p className="text-gray-600 mb-6">
              Таны нууц үг амжилттай өөрчлөгдлөө. Одоо шинэ нууц үгээрээ нэвтэрч
              болно.
            </p>

            <button
              onClick={handleGoToLogin}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-4"
            >
              Нэвтрэх хуудас руу очих
            </button>

            <Link
              href="/"
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              ← Нүүр хуудас руу буцах
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
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
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Шинэ нууц үг тохируулах
              </h1>

              <p className="text-gray-600">
                Код баталгаажлаа! Одоо шинэ нууц үгээ оруулна уу.
              </p>
            </div>

            <form
              onSubmit={handleSubmitReset(onSubmitResetPassword)}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Шинэ нууц үг
                </label>
                <div className="relative">
                  <input
                    {...registerReset("newPassword")}
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errorsReset.newPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {errorsReset.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Нууц үг баталгаажуулах
                </label>
                <div className="relative">
                  <input
                    {...registerReset("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errorsReset.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {errorsReset.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
                    <span>Өөрчилж байна...</span>
                  </>
                ) : (
                  <span>Нууц үг өөрчлөх</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Нүүр хуудас руу буцах
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
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

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Баталгаажуулах код оруулах
            </h1>

            <p className="text-gray-600">
              <strong>{email}</strong> хаяг руу илгээсэн 6 оронтой кодыг оруулна
              уу.
            </p>
          </div>

          <form
            onSubmit={handleSubmitVerify(onSubmitVerifyCode)}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Баталгаажуулах код
              </label>
              <input
                {...registerVerify("code")}
                type="text"
                id="code"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono font-bold tracking-widest"
                placeholder="000000"
                disabled={isLoading}
                style={{ letterSpacing: "0.5em" }}
              />
              {errorsVerify.code && (
                <p className="mt-2 text-sm text-red-600">
                  {errorsVerify.code.message}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Код {codeValue.length}/6 тэмдэгт
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || codeValue.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
                  <span>Шалгаж байна...</span>
                </>
              ) : (
                <span>Код баталгаажуулах</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-600 text-sm">Код ирсэнгүй үү?</p>
            <button
              onClick={handleResendCode}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Дахин илгээх
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Нүүр хуудас руу буцах
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Ачааллаж байна...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
