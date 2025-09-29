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

const FooterContext = createContext<FooterContextType | undefined>(undefined);

const defaultFooterContent: FooterContent = {
  companyDescription: "",
  email: "",
  phone: "",
  address: "",
  facebook: "",
  instagram: "",
  youtube: "",
  privacyPolicy: "",
  termsOfService: "",
  copyright: "",
};

const sanitizeFooterUpdates = (content: Partial<FooterContent>) => {
  const sanitized: Partial<FooterContent> = {};

  (
    Object.entries(content) as [
      keyof FooterContent,
      FooterContent[keyof FooterContent]
    ][]
  ).forEach(([key, value]) => {
    if (typeof value === "string") {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

export function FooterProvider({ children }: { children: ReactNode }) {
  const [footerContent, setFooterContent] =
    useState<FooterContent>(defaultFooterContent);
  const [loading, setLoading] = useState(true);

  const updateFooterContent = (content: Partial<FooterContent>) => {
    setFooterContent((prev) => ({
      ...prev,
      ...sanitizeFooterUpdates(content),
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
          setFooterContent((prev) => ({
            ...prev,
            ...sanitizeFooterUpdates(data.footer),
          }));
        }
      } else {
        console.warn("Failed to fetch footer content, using defaults");
      }
    } catch (error) {
      console.warn("Error fetching footer content:", error);
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
