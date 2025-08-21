import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { FooterProvider } from "@/contexts/FooterContext";
import { ProgramsProvider } from "@/contexts/ProgramsContext";
import { UniversityProvider } from "@/contexts/UniversityContext";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GrandEdu - Хятадад зуучлах баталгаат хамт олон",
  description: "Монголын оюутан залуусыг Хятад улс руу зуучлах вэбсайт",
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
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
