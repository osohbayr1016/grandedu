"use client";

import { useEffect } from "react";

interface StructuredDataProps {
  type?: "organization" | "website" | "webpage";
  data?: Record<string, unknown>;
}

export default function StructuredData({
  type = "website",
  data,
}: StructuredDataProps) {
  useEffect(() => {
    // Remove any existing structured data scripts
    const existingScripts = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    existingScripts.forEach((script) => script.remove());

    // Create and append new structured data
    const script = document.createElement("script");
    script.type = "application/ld+json";

    let structuredData;

    switch (type) {
      case "organization":
        structuredData = {
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "GrandEdu",
          alternateName: "GrandEdu - Хятадад зуучлах баталгаат хамт олон",
          description:
            "Монголын оюутан залуусыг Хятад улсад суралцахад мэргэжлийн зуучлал, их сургуулиудын мэдээлэл, хөтөлбөрүүдийн зөвлөгөө өгдөг найдвартай платформ.",
          url: "https://grandedu.mn",
          logo: "https://grandedu.mn/logo.png",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+976-9999-9999",
            contactType: "customer service",
            availableLanguage: ["Mongolian", "Chinese"],
          },
          sameAs: [
            "https://facebook.com/grandedu",
            "https://twitter.com/grandedu",
          ],
          address: {
            "@type": "PostalAddress",
            addressCountry: "MN",
            addressLocality: "Ulaanbaatar",
          },
          areaServed: "MN",
          serviceType: [
            "Education Consulting",
            "Student Exchange",
            "University Admission",
          ],
          knowsAbout: [
            "Chinese Universities",
            "Student Visa",
            "Scholarships",
            "Academic Programs",
          ],
        };
        break;

      case "webpage":
        structuredData = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: data?.title || "GrandEdu - Хятадад суралцах",
          description:
            data?.description ||
            "Монголын оюутан залуусыг Хятад улсад суралцахад мэргэжлийн зуучлал, их сургуулиудын мэдээлэл, хөтөлбөрүүдийн зөвлөгөө өгдөг найдвартай платформ.",
          url: data?.url || "https://grandedu.mn",
          isPartOf: {
            "@type": "WebSite",
            name: "GrandEdu",
            url: "https://grandedu.mn",
          },
          about: {
            "@type": "Thing",
            name: "Chinese Education",
            description:
              "Higher education opportunities in China for Mongolian students",
          },
          mainEntity: {
            "@type": "EducationalOrganization",
            name: "GrandEdu",
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Нүүр",
                item: "https://grandedu.mn",
              },
              ...(Array.isArray(data?.breadcrumbs) ? data.breadcrumbs : []),
            ],
          },
        };
        break;

      default:
        structuredData = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "GrandEdu",
          alternateName: "GrandEdu - Хятадад зуучлах баталгаат хамт олон",
          description:
            "Монголын оюутан залуусыг Хятад улсад суралцахад мэргэжлийн зуучлал, их сургуулиудын мэдээлэл, хөтөлбөрүүдийн зөвлөгөө өгдөг найдвартай платформ.",
          url: "https://grandedu.mn",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://grandedu.mn/search?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
          publisher: {
            "@type": "EducationalOrganization",
            name: "GrandEdu",
          },
        };
    }

    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      scripts.forEach((s) => s.remove());
    };
  }, [type, data]);

  return null; // This component doesn't render anything
}
