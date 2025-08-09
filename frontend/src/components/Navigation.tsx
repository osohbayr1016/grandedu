"use client";

import { useAuth } from "@/contexts/AuthContext";
import { defaultContent } from "@/utils/defaultContent";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-shadow bg-white ${
        isScrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center py-4">
          <div className="flex items-center col-start-1">
            <a href="/" className="text-xl font-bold text-blue-700">
              {defaultContent.navigation.logo}
            </a>
          </div>

          <div className="hidden md:flex justify-center items-center space-x-6 md:col-start-2">
            <a
              href="/"
              className={`hover:text-blue-700 ${
                pathname === "/"
                  ? "text-blue-700 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {defaultContent.navigation.homeLink}
            </a>
            <a
              href="/programs"
              className={`hover:text-blue-700 ${
                pathname?.startsWith("/programs")
                  ? "text-blue-700 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {defaultContent.navigation.programsLink}
            </a>
            <a
              href="/news"
              className={`hover:text-blue-700 ${
                pathname?.startsWith("/news")
                  ? "text-blue-700 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {defaultContent.navigation.newsLink}
            </a>
            <a
              href="/universities"
              className={`hover:text-blue-700 ${
                pathname?.startsWith("/universities")
                  ? "text-blue-700 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {defaultContent.navigation.universitiesLink}
            </a>
            <a href="#contact" className="text-gray-600 hover:text-blue-700">
              {defaultContent.navigation.contactLink}
            </a>
          </div>

          <div className="flex items-center justify-end space-x-3 col-start-2 md:col-start-3">
            {user ? (
              <>
                <span className="hidden sm:block text-gray-700 text-sm">
                  {defaultContent.navigation.welcomeMessage.replace(
                    "{firstName}",
                    user.firstName
                  )}
                </span>
                {user.role === "admin" && (
                  <a
                    href="/admin"
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    {defaultContent.navigation.adminButton}
                  </a>
                )}
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                >
                  {defaultContent.navigation.logoutButton}
                </button>
              </>
            ) : (
              <a
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                {defaultContent.navigation.loginButton}
              </a>
            )}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a
              href="/"
              className={`block px-2 py-2 rounded hover:bg-gray-100 ${
                pathname === "/"
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {defaultContent.navigation.homeLink}
            </a>
            <a
              href="/programs"
              className={`block px-2 py-2 rounded hover:bg-gray-100 ${
                pathname?.startsWith("/programs")
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {defaultContent.navigation.programsLink}
            </a>
            <a
              href="/news"
              className={`block px-2 py-2 rounded hover:bg-gray-100 ${
                pathname?.startsWith("/news")
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {defaultContent.navigation.newsLink}
            </a>
            <a
              href="/universities"
              className={`block px-2 py-2 rounded hover:bg-gray-100 ${
                pathname?.startsWith("/universities")
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {defaultContent.navigation.universitiesLink}
            </a>
            <a
              href="#contact"
              className="block px-2 py-2 rounded hover:bg-gray-100 text-gray-700"
            >
              {defaultContent.navigation.contactLink}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
