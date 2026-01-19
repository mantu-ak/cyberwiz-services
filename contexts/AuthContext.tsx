import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  user_type: "user" | "service_provider" | "admin";
  profile_image?: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  googleLogin: (googleData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("access_token");
      const savedUser = await AsyncStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // ✅ SET AUTHORIZATION HEADER FOR STORED TOKEN
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      }
    } catch (error) {
      console.error("Failed to restore token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });

      if (response.data.success) {
        const { access_token, user: userData } = response.data;

        // ✅ VALIDATE TOKEN EXISTS BEFORE STORING
        if (!access_token) {
          throw new Error("No token received from server");
        }

        await AsyncStorage.setItem("access_token", access_token);
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        // ✅ SET AUTHORIZATION HEADER IMMEDIATELY AFTER LOGIN
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${access_token}`;

        setToken(access_token);
        setUser(userData);
      } else {
        throw new Error(response.data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(userData);

      if (response.data.success) {
        const { access_token, user_id } = response.data;

        // ✅ VALIDATE TOKEN EXISTS BEFORE STORING
        if (!access_token) {
          throw new Error("No token received from server");
        }

        await AsyncStorage.setItem("access_token", access_token);

        // ✅ SET AUTHORIZATION HEADER IMMEDIATELY AFTER REGISTER
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${access_token}`;

        setToken(access_token);
        setUser({
          id: user_id,
          name: userData.name,
          email: userData.email,
          user_type: "user",
          status: "active",
        });
      } else {
        throw new Error(response.data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (googleData: any) => {
    try {
      setIsLoading(true);
      const response = await authAPI.googleLogin(googleData);

      if (response.data.success) {
        const { access_token, user_id } = response.data;

        // ✅ VALIDATE TOKEN EXISTS BEFORE STORING
        if (!access_token) {
          throw new Error("No token received from server");
        }

        await AsyncStorage.setItem("access_token", access_token);

        // ✅ SET AUTHORIZATION HEADER IMMEDIATELY AFTER GOOGLE LOGIN
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${access_token}`;

        setToken(access_token);
        setUser({
          id: user_id,
          name: googleData.name,
          email: googleData.email,
          profile_image: googleData.profile_image,
          user_type: "user",
          status: "active",
        });
      } else {
        throw new Error(response.data.error || "Google login failed");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("user");

      // ✅ CLEAR AUTHORIZATION HEADER ON LOGOUT
      delete axios.defaults.headers.common["Authorization"];

      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isSignedIn: !!token,
        login,
        register,
        googleLogin,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
