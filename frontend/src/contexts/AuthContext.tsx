"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { getLoginUrl, getSignupUrl } from "@/utils/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Initial load - storedUser:", parsedUser);
      console.log("Initial load - storedUser.role:", parsedUser.role);
      console.log(
        "Initial load - storedUser.role type:",
        typeof parsedUser.role
      );
      setToken(storedToken);
      setUser(parsedUser);
    } else {
      console.log("Initial load - No stored token or user found");
      console.log("Initial load - storedToken:", !!storedToken);
      console.log("Initial load - storedUser:", !!storedUser);
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(getLoginUrl(), {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;

      console.log("Login response - userData:", userData);
      console.log("Login response - userData.role:", userData.role);
      console.log("Login response - userData.role type:", typeof userData.role);

      setToken(newToken);
      setUser(userData);

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("Login - Token saved to localStorage");
      console.log(
        "Login - User saved to localStorage:",
        JSON.stringify(userData)
      );

      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      throw new Error(axiosError.response?.data?.message || "Login failed");
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      const response = await axios.post(getSignupUrl(), userData);

      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));

      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      throw new Error(axiosError.response?.data?.message || "Signup failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
