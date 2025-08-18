"use client";

import { useAuth } from "@/contexts/AuthContext";
import { defaultContent } from "@/utils/defaultContent";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navigation() {
  const { user, logout, setShowAuth } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        event.target instanceof Node &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-shadow bg-white ${
        isScrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 ">
          <div className="flex items-center ">
            <Link href="/" className="text-xl font-bold text-black">
              {defaultContent.navigation.logo}
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8 lg:space-x-10 ">
            <Link
              href="/"
              className={`hover:text-blue-700 ${
                pathname === "/"
                  ? "text-blue-700 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {defaultContent.navigation.homeLink}
            </Link>
            <Link
              href="/programs"
              className={`hover:text-blue-700 ${
                pathname?.startsWith("/programs")
                  ? "text-blue-700 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {defaultContent.navigation.programsLink}
            </Link>
            <Link
              href="/news"
              className={`hover:text-blue-700 ${
                pathname?.startsWith("/news")
                  ? "text-blue-700 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {defaultContent.navigation.newsLink}
            </Link>
            <Link
              href="/universities"
              className={`hover:text-blue-700 ${
                pathname?.startsWith("/universities")
                  ? "text-blue-700 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {defaultContent.navigation.universitiesLink}
            </Link>
            <a href="#contact" className="text-gray-600 hover:text-blue-700">
              {defaultContent.navigation.contactLink}
            </a>
          </div>

          <div className="flex items-center justify-end space-x-3">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    {defaultContent.navigation.adminButton}
                  </Link>
                )}
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen((open) => !open)}
                    className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                    aria-label="User menu"
                  >
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 9a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4.5 20a7.5 7.5 0 0115 0"
                      />
                    </svg>
                  </button>
                  {userMenuOpen && (
                    <div
                      role="menu"
                      aria-orientation="vertical"
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md ring-1 ring-black/5 z-50 overflow-hidden"
                    >
                      <Link
                        href="/profile"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 block"
                      >
                        Профайл
                      </Link>
                      <button
                        role="menuitem"
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        {defaultContent.navigation.logoutButton}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                {defaultContent.navigation.loginButton}
              </button>
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
          <div className="md:hidden pb-4 space-y-3">
            <Link
              href="/"
              className={`block px-2 py-2 rounded hover:bg-gray-100 ${
                pathname === "/"
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {defaultContent.navigation.homeLink}
            </Link>
            <Link
              href="/programs"
              className={`block px-2 py-2 rounded hover:bg-gray-100 ${
                pathname?.startsWith("/programs")
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {defaultContent.navigation.programsLink}
            </Link>
            <Link
              href="/news"
              className={`block px-2 py-2 rounded hover:bg-gray-100 ${
                pathname?.startsWith("/news")
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {defaultContent.navigation.newsLink}
            </Link>
            <Link
              href="/universities"
              className={`block px-2 py-2 rounded hover:bg-gray-100 ${
                pathname?.startsWith("/universities")
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {defaultContent.navigation.universitiesLink}
            </Link>
            <a
              href="#contact"
              className="block px-2 py-2 rounded hover:bg-gray-100 text-gray-700"
            >
              {defaultContent.navigation.contactLink}
            </a>
            {!user && (
              <button
                onClick={() => {
                  setShowAuth(true);
                  setMobileOpen(false);
                }}
                className="block w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-blue-600 font-medium"
              >
                {defaultContent.navigation.loginButton}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
