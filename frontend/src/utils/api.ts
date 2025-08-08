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

// Get API base URL dynamically
export const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // If not localhost, use production URL
    if (window.location.hostname !== "localhost") {
      console.log(
        "Using production API URL:",
        "https://grandedu-g5yo.onrender.com"
      );
      return "https://grandedu-g5yo.onrender.com";
    }
  }

  // Check environment variables for development
  if (process.env.NODE_ENV === "development") {
    console.log("Using development API URL:", "http://localhost:5001");
    return "http://localhost:5001";
  }

  // Default to production for any other case (including Vercel)
  console.log(
    "Using production API URL (default):",
    "https://grandedu-g5yo.onrender.com"
  );
  return "https://grandedu-g5yo.onrender.com";
};

// Health check endpoint
export const getHealthCheckUrl = () => {
  const url = `${getApiBaseUrl()}/api/health`;
  console.log("Health check URL:", url);
  return url;
};

// Auth endpoints
export const getLoginUrl = () => {
  const url = `${getApiBaseUrl()}/api/auth/login`;
  console.log("Login URL:", url);
  return url;
};

export const getSignupUrl = () => {
  const url = `${getApiBaseUrl()}/api/auth/signup`;
  console.log("Signup URL:", url);
  return url;
};

// Content endpoints
export const getContentUrl = () => {
  const url = `${getApiBaseUrl()}/api/content`;
  console.log("Content URL:", url);
  return url;
};

export const getHomeContentUrl = () => {
  const url = `${getApiBaseUrl()}/api/content/home`;
  console.log("Home content URL:", url);
  return url;
};

export const getProgramsContentUrl = () => {
  const url = `${getApiBaseUrl()}/api/content/programs`;
  console.log("Programs content URL:", url);
  return url;
};

export const getNavigationContentUrl = () => {
  const url = `${getApiBaseUrl()}/api/content/navigation`;
  console.log("Navigation content URL:", url);
  return url;
};

// Programs endpoints
export const getProgramsUrl = () => {
  const url = `${getApiBaseUrl()}/api/programs`;
  console.log("Programs URL:", url);
  return url;
};
