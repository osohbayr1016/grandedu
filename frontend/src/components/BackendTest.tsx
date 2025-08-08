"use client";

import { useState, useEffect } from "react";
import { getHealthCheckUrl, getApiBaseUrl } from "@/utils/api";

export default function BackendTest() {
  const [status, setStatus] = useState<string>("Testing...");
  const [error, setError] = useState<string>("");
  const [apiUrl, setApiUrl] = useState<string>("");

  useEffect(() => {
    const testBackend = async () => {
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
        });

        if (response.ok) {
          const data = await response.json();
          setStatus(`✅ Connected: ${data.message || data.status}`);
          setError("");
        } else {
          setStatus(`❌ Error: ${response.status} ${response.statusText}`);
          setError(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setStatus(`❌ Connection failed: ${errorMessage}`);
        setError(errorMessage);
      }
    };

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
      </div>
    </div>
  );
}
