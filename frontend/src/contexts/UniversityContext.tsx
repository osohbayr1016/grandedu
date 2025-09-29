"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getContentUrl } from "@/utils/api";

interface UniversitySectionContent {
  programsTitle: string;
  programsDescription: string;
  programsAdminNote: string; // Admin-only field for program types/notes
  admissionRequirementsTitle: string;
  admissionRequirementsDescription: string;
  cityLifeTitle: string;
  cityLifeDescription: string;
}

interface UniversityContextType {
  universitySectionContent: UniversitySectionContent;
  updateUniversitySectionContent: (
    content: Partial<UniversitySectionContent>
  ) => void;
  loading: boolean;
  refreshUniversitySectionContent: (universityId?: string) => Promise<void>;
  loadUniversitySectionContent: (universityId: string) => Promise<void>;
  resetToDefaults: () => void;
}

const emptyUniversitySectionContent: UniversitySectionContent = {
  programsTitle: "",
  programsDescription: "",
  programsAdminNote: "",
  admissionRequirementsTitle: "",
  admissionRequirementsDescription: "",
  cityLifeTitle: "",
  cityLifeDescription: "",
};

const UniversityContext = createContext<UniversityContextType | undefined>(
  undefined
);

export function UniversityProvider({ children }: { children: ReactNode }) {
  const [universitySectionContent, setUniversitySectionContent] =
    useState<UniversitySectionContent>(emptyUniversitySectionContent);
  const [loading, setLoading] = useState(true);

  const updateUniversitySectionContent = (
    content: Partial<UniversitySectionContent>
  ) => {
    setUniversitySectionContent((prev) => ({
      ...prev,
      ...content,
    }));
  };

  const fetchUniversitySectionContent = async (universityId?: string) => {
    try {
      setLoading(true);
      const url = universityId
        ? `${getContentUrl()}/university-sections/${universityId}`
        : `${getContentUrl()}/university-sections`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (response.ok) {
        const data = await response.json();

        if (
          data.universitySections &&
          typeof data.universitySections === "object"
        ) {
          setUniversitySectionContent((prev) => ({
            ...prev,
            ...data.universitySections,
          }));
        } else {
          setUniversitySectionContent(emptyUniversitySectionContent);
        }
      } else {
        console.warn(
          "Failed to fetch university section content, using defaults"
        );
        setUniversitySectionContent(emptyUniversitySectionContent);
      }
    } catch (error) {
      console.warn(
        "Error fetching university section content, using defaults:",
        error
      );
      setUniversitySectionContent(emptyUniversitySectionContent);
    } finally {
      setLoading(false);
    }
  };

  const loadUniversitySectionContent = async (universityId: string) => {
    await fetchUniversitySectionContent(universityId);
  };

  const refreshUniversitySectionContent = async (universityId?: string) => {
    await fetchUniversitySectionContent(universityId);
  };

  const resetToDefaults = () => {
    setUniversitySectionContent(emptyUniversitySectionContent);
  };

  useEffect(() => {
    fetchUniversitySectionContent();
  }, []);

  return (
    <UniversityContext.Provider
      value={{
        universitySectionContent,
        updateUniversitySectionContent,
        loading,
        refreshUniversitySectionContent,
        loadUniversitySectionContent,
        resetToDefaults,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
}

export function useUniversity() {
  const context = useContext(UniversityContext);
  if (context === undefined) {
    throw new Error("useUniversity must be used within a UniversityProvider");
  }
  return context;
}
