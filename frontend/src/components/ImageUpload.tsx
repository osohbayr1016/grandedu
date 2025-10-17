"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function ImageUpload({
  value = "",
  onChange,
  label = "Зураг",
  placeholder = "Зургийн URL эсвэл файл сонгоно уу",
  disabled = false,
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Зөвхөн зургийн файл сонгоно уу");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Файлын хэмжээ 5MB-аас ихгүй байх ёстой");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      // For demo purposes, we'll create a data URL
      // In production, you'd upload to a cloud storage service
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        onChange(dataUrl);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError("Файл уншихад алдаа гарлаа");
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setPreview(url);
    setError("");
    onChange(url);
  };

  const handleRemove = () => {
    setPreview("");
    setError("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* URL Input */}
      <div className="flex space-x-2">
        <input
          type="url"
          value={preview}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isUploading}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={handleFileButtonClick}
          disabled={disabled || isUploading}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 rounded-md text-sm font-medium transition-colors"
        >
          Файл сонгох
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Image preview */}
      {preview && (
        <div className="relative w-full max-w-xs h-32">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled || isUploading}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center text-xs transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload progress */}
      {isUploading && (
        <div className="flex items-center text-sm text-blue-600">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
          Зураг байршуулж байна...
        </div>
      )}
    </div>
  );
}
