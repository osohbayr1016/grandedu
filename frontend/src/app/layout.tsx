import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { FooterProvider } from "@/contexts/FooterContext";
import { ProgramsProvider } from "@/contexts/ProgramsContext";
import { UniversityProvider } from "@/contexts/UniversityContext";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "GrandEdu - Хятадад зуучлах баталгаат хамт олон",
    template: "%s | GrandEdu",
  },
  description:
    "Монголын оюутан залуусыг Хятад улсад суралцахад мэргэжлийн зуучлал, их сургуулиудын мэдээлэл, хөтөлбөрүүдийн зөвлөгөө өгдөг найдвартай платформ.",
  keywords: [
    "Хятад сургууль",
    "зуучлал",
    "оюутан солилцоо",
    "их сургууль",
    "бакалавр",
    "магистр",
    "доктор",
    "Хятад",
    "суралцах",
    "тэтгэлэг",
  ],
  authors: [{ name: "GrandEdu Team" }],
  creator: "GrandEdu",
  publisher: "GrandEdu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://grandedu.mn"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "mn_MN",
    url: "https://grandedu.mn",
    title: "GrandEdu - Хятадад зуучлах баталгаат хамт олон",
    description:
      "Монголын оюутан залуусыг Хятад улсад суралцахад мэргэжлийн зуучлал, их сургуулиудын мэдээлэл, хөтөлбөрүүдийн зөвлөгөө өгдөг найдвартай платформ.",
    siteName: "GrandEdu",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GrandEdu - Хятадад суралцах",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrandEdu - Хятадад зуучлах баталгаат хамт олон",
    description:
      "Монголын оюутан залуусыг Хятад улсад суралцахад мэргэжлийн зуучлал, их сургуулиудын мэдээлэл, хөтөлбөрүүдийн зөвлөгөө өгдөг найдвартай платформ.",
    images: ["/og-image.jpg"],
    creator: "@grandedu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/favicon.jpg" />
        <meta name="msapplication-TileImage" content="/favicon.jpg" />
      </head>
      <body className={`${inter.className} bg-white`}>
        <StructuredData type="organization" />
        <AuthProvider>
          <FooterProvider>
            <ProgramsProvider>
              <UniversityProvider>
                <Navigation />
                {children}
                <Footer />
              </UniversityProvider>
            </ProgramsProvider>
          </FooterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
