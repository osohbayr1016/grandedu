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
    // Always use production URL in deployed environment
    if (
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      console.log(
        "Using production API URL (deployed):",
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

// Connection test utility
export const testBackendConnection = async (): Promise<{
  success: boolean;
  error?: string;
  url: string;
  timestamp: string;
}> => {
  const url = getApiBaseUrl();
  const healthUrl = `${url}/api/health`;
  
  try {
    console.log("Testing backend connection to:", healthUrl);
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to avoid hanging
      signal: AbortSignal.timeout(10000), // 10 seconds
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Backend connection successful:", data);
    
    return {
      success: true,
      url: healthUrl,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Backend connection failed:", errorMessage);
    
    return {
      success: false,
      error: errorMessage,
      url: healthUrl,
      timestamp: new Date().toISOString(),
    };
  }
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

export const getAdminProgramsUrl = () => {
  const url = `${getApiBaseUrl()}/api/programs/admin`;
  console.log("Admin Programs URL:", url);
  return url;
};

// News endpoints
export const getNewsUrl = () => {
  const url = `${getApiBaseUrl()}/api/news`;
  console.log("News URL:", url);
  return url;
};

export const getAdminNewsUrl = () => {
  const url = `${getApiBaseUrl()}/api/news/admin`;
  console.log("Admin News URL:", url);
  return url;
};

// Universities endpoints
export const getUniversitiesUrl = () => {
  const url = `${getApiBaseUrl()}/api/universities`;
  console.log("Universities URL:", url);
  return url;
};

export const getAdminUniversitiesUrl = () => {
  const url = `${getApiBaseUrl()}/api/universities/admin`;
  console.log("Admin Universities URL:", url);
  return url;
};

// User management endpoints
export const getUsersUrl = () => {
  const url = `${getApiBaseUrl()}/api/auth/users`;
  console.log("Users URL:", url);
  return url;
};

export const getStatsUrl = () => {
  const url = `${getApiBaseUrl()}/api/auth/stats`;
  console.log("Stats URL:", url);
  return url;
};

export const getCreateAdminUrl = () => {
  const url = `${getApiBaseUrl()}/api/auth/create-admin`;
  console.log("Create Admin URL:", url);
  return url;
};

// Password reset endpoints
export const getForgotPasswordUrl = () => {
  const url = `${getApiBaseUrl()}/api/auth/forgot-password`;
  console.log("Forgot Password URL:", url);
  return url;
};

export const getVerifyResetCodeUrl = () => {
  const url = `${getApiBaseUrl()}/api/auth/verify-reset-code`;
  console.log("Verify Reset Code URL:", url);
  return url;
};

export const getResetPasswordUrl = () => {
  const url = `${getApiBaseUrl()}/api/auth/reset-password`;
  console.log("Reset Password URL:", url);
  return url;
};

// Utility function for authenticated fetch requests
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  console.log("Making authenticated request to:", url);
  console.log("Request options:", mergedOptions);

  const response = await fetch(url, mergedOptions);

  // If unauthorized, clear token and throw error
  if (response.status === 401) {
    console.log("Authentication failed, clearing token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw new Error("Authentication failed. Please log in again.");
  }

  // If server error, log details
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Request failed:", response.status, errorText);
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`
    );
  }

  return response;
};
