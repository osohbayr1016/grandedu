"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>("Loading...");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/health");
        const data = await response.json();
        setBackendStatus(data.status);
        setIsConnected(true);
      } catch (error) {
        setBackendStatus("Disconnected");
        setIsConnected(false);
      }
    };

    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Section - Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Let us be your bridge to the{" "}
              <span className="text-red-600">Future</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
              We are committed to providing a stimulating, secure, enjoyable,
              environment for learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Register Now
              </button>
              <div className="flex items-center justify-center lg:justify-start text-red-600 font-medium cursor-pointer hover:text-red-700 transition-colors duration-200">
                Read more
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-96 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    VOCABULARY & READING
                  </h3>
                  <p className="text-gray-600">(A1-A2)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Status Indicator (Hidden by default, can be toggled) */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-xs text-gray-600">
              {isConnected ? "Backend Connected" : "Backend Disconnected"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
