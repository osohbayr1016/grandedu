"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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

  const updateFooterContent = (content: Partial<FooterContent>) => {
    setFooterContent((prev) => ({
      ...prev,
      ...content,
    }));
  };

  return (
    <FooterContext.Provider value={{ footerContent, updateFooterContent }}>
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
