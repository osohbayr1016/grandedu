"use client";

import { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/utils/api";

interface FooterContent {
  email?: string;
  phone?: string;
  address?: string;
}

export default function ContactInfo() {
  const [footerContent, setFooterContent] = useState<FooterContent>({
    email: "info@grandedu.mn",
    phone: "+976 9999 9999",
    address: "Улаанбаатар хот",
  });

  useEffect(() => {
    loadFooterContent();
  }, []);

  const loadFooterContent = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/content/footer`);
      if (response.ok) {
        const data = await response.json();
        setFooterContent({
          email: data.email || "info@grandedu.mn",
          phone: data.phone || "+976 9999 9999",
          address: data.address || "Улаанбаатар хот",
        });
      }
    } catch (error) {
      console.error("Error loading footer content:", error);
    }
  };

  return (
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
          <p className="text-sm text-gray-600">{footerContent.email}</p>
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
          <p className="text-sm text-gray-600">{footerContent.phone}</p>
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
          <p className="text-sm text-gray-600">{footerContent.address}</p>
        </div>
      </div>
    </div>
  );
}
