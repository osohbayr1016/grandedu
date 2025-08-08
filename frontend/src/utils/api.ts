// API URL configuration for both local development and production
const getApiUrl = () => {
  // In production, always use the production URL
  if (process.env.NODE_ENV === "production") {
    return "https://grandedu-g5yo.onrender.com";
  }

  // In development, try localhost first, fallback to production
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
};

// Test if localhost is available
const testLocalhost = async (): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:5001/api/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Short timeout to avoid long waits
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Get the best available API URL
export const getBestApiUrl = async (): Promise<string> => {
  if (process.env.NODE_ENV === "development") {
    const isLocalhostAvailable = await testLocalhost();
    if (isLocalhostAvailable) {
      return "http://localhost:5001";
    }
    // Fallback to production if localhost is not available
    return "https://grandedu-g5yo.onrender.com";
  }

  return "https://grandedu-g5yo.onrender.com";
};

// Default API URL (for immediate use)
export const API_BASE_URL = getApiUrl();

// Health check endpoint
export const HEALTH_CHECK_URL = `${API_BASE_URL}/api/health`;

// Auth endpoints
export const LOGIN_URL = `${API_BASE_URL}/api/auth/login`;
export const SIGNUP_URL = `${API_BASE_URL}/api/auth/signup`;

// Content endpoints
export const CONTENT_URL = `${API_BASE_URL}/api/content`;
export const HOME_CONTENT_URL = `${API_BASE_URL}/api/content/home`;
export const PROGRAMS_CONTENT_URL = `${API_BASE_URL}/api/content/programs`;
export const NAVIGATION_CONTENT_URL = `${API_BASE_URL}/api/content/navigation`;

// Programs endpoints
export const PROGRAMS_URL = `${API_BASE_URL}/api/programs`;
