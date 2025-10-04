"use client";

import StructuredData from "@/components/StructuredData";

interface PageStructuredDataProps {
  type: "university" | "program" | "news" | "webpage";
  data: {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    breadcrumbs?: Array<{ name: string; url: string }>;
  };
}

export default function PageStructuredData({
  type,
  data,
}: PageStructuredDataProps) {
  const getStructuredData = () => {

    switch (type) {
      case "university":
        return {
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: data.title,
          description: data.description,
          url: data.url,
          image: data.image,
          address: {
            "@type": "PostalAddress",
            addressCountry: "CN",
          },
          educationalCredentialAwarded: "Degree",
          hasEducationalUse: "Higher Education",
        };

      case "program":
        return {
          "@context": "https://schema.org",
          "@type": "EducationalOccupationalProgram",
          name: data.title,
          description: data.description,
          url: data.url,
          provider: {
            "@type": "EducationalOrganization",
            name: "GrandEdu",
          },
          educationalProgramMode: "Full-time",
          programPrerequisites: "High School Diploma",
        };

      case "news":
        return {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: data.title,
          description: data.description,
          url: data.url,
          image: data.image,
          datePublished: data.datePublished,
          dateModified: data.dateModified,
          author: {
            "@type": "Person",
            name: data.author || "GrandEdu Team",
          },
          publisher: {
            "@type": "EducationalOrganization",
            name: "GrandEdu",
            logo: {
              "@type": "ImageObject",
              url: "https://grandedu.mn/logo.png",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": data.url,
          },
        };

      default:
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: data.title,
          description: data.description,
          url: data.url,
          isPartOf: {
            "@type": "WebSite",
            name: "GrandEdu",
            url: "https://grandedu.mn",
          },
        };
    }
  };

  return <StructuredData type="webpage" data={getStructuredData()} />;
}
