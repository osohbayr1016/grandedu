"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getContentUrl } from "@/utils/api";

interface FooterContent {
  companyDescription: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  privacyPolicy: string;
  termsOfService: string;
  copyright: string;
}

interface FooterContextType {
  footerContent: FooterContent;
  updateFooterContent: (content: Partial<FooterContent>) => void;
  loading: boolean;
  refreshFooterContent: () => Promise<void>;
}

const defaultFooterContent: FooterContent = {
  companyDescription:
    "Хятадын их сургуулиудад суралцах боломжийг таньд санал болгож байна.",
  email: "info@grandedu.mn",
  phone: "+976 0000-0000",
  address: "Улаанбаатар, Монгол",
  facebook: "#",
  instagram: "#",
  youtube: "#",
  privacyPolicy: "#",
  termsOfService: "#",
  copyright: "© 2024 GrandEdu. Бүх эрх хуулиар хамгаалагдсан.",
};

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export function FooterProvider({ children }: { children: ReactNode }) {
  const [footerContent, setFooterContent] =
    useState<FooterContent>(defaultFooterContent);
  const [loading, setLoading] = useState(true);

  const updateFooterContent = (content: Partial<FooterContent>) => {
    setFooterContent((prev) => ({
      ...prev,
      ...content,
    }));
  };

  const fetchFooterContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${getContentUrl()}/footer`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (response.ok) {
        const data = await response.json();

        // Transform the grouped content back to FooterContent format
        if (data.footer && typeof data.footer === "object") {
          const transformedContent: Partial<FooterContent> = {};

          // Map the backend data to our FooterContent interface
          Object.keys(defaultFooterContent).forEach((key) => {
            if (data.footer[key]) {
              transformedContent[key as keyof FooterContent] = data.footer[key];
            }
          });

          // Update only the fields that exist in the backend
          if (Object.keys(transformedContent).length > 0) {
            setFooterContent((prev) => ({
              ...prev,
              ...transformedContent,
            }));
          }
        }
      } else {
        console.warn("Failed to fetch footer content, using defaults");
      }
    } catch (error) {
      console.warn("Error fetching footer content, using defaults:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshFooterContent = async () => {
    await fetchFooterContent();
  };

  useEffect(() => {
    fetchFooterContent();
  }, []);

  return (
    <FooterContext.Provider
      value={{
        footerContent,
        updateFooterContent,
        loading,
        refreshFooterContent,
      }}
    >
      {children}
    </FooterContext.Provider>
  );
}

export function useFooter() {
  const context = useContext(FooterContext);
  if (context === undefined) {
    throw new Error("useFooter must be used within a FooterProvider");
  }
  return context;
}
