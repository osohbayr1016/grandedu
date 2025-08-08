"use client";

import { useState, useEffect } from "react";
import { getHealthCheckUrl, getApiBaseUrl } from "@/utils/api";

export default function BackendTest() {
  const [status, setStatus] = useState<string>("Testing...");
  const [error, setError] = useState<string>("");
  const [apiUrl, setApiUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const testBackend = async () => {
    setIsLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      setApiUrl(baseUrl);

      const healthUrl = getHealthCheckUrl();
      console.log("Testing backend connection to:", healthUrl);

      const response = await fetch(healthUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(`✅ Connected: ${data.message || data.status}`);
        setError("");
      } else {
        setStatus(`❌ Error: ${response.status} ${response.statusText}`);
        setError(`HTTP ${response.status}: ${response.statusText}`);

        // Log response details for debugging
        try {
          const errorData = await response.text();
          console.error("Response body:", errorData);
        } catch (e) {
          console.error("Could not read response body");
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setStatus(`❌ Connection failed: ${errorMessage}`);
      setError(errorMessage);
      console.error("Backend connection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testBackend();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm z-50">
      <h3 className="font-semibold text-gray-900 mb-2">
        Backend Connection Test
      </h3>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">API URL:</span> {apiUrl}
        </div>
        <div>
          <span className="font-medium">Status:</span> {status}
        </div>
        {error && (
          <div className="text-red-600">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}
        <button
          onClick={testBackend}
          disabled={isLoading}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-xs"
        >
          {isLoading ? "Testing..." : "Test Again"}
        </button>
      </div>
    </div>
  );
}
