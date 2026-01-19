import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

const API_BASE_URL = "http://192.168.31.225:5000/api"; // Update with your PC IP

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ REQUEST INTERCEPTOR - Add token and handle content type
api.interceptors.request.use(
  async (config) => {
    try {
      // Get token from storage
      const token = await AsyncStorage.getItem("access_token");

      // ✅ FIX: Only add Authorization header if token exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Token attached:", token.substring(0, 20) + "...");
      } else {
        console.warn("⚠️ No token found in storage");
      }

      // ✅ FIX: Handle FormData - don't set Content-Type, let axios handle it
      if (config.data instanceof FormData) {
        // Remove Content-Type header for FormData - axios will set it with boundary
        delete config.headers["Content-Type"];
        console.log(
          "📦 FormData request detected - Content-Type will be auto-set",
        );
      }

      // Log request details
      const method = config.method?.toUpperCase() || "UNKNOWN";
      const url = config.url?.replace(API_BASE_URL, "") || config.url;
      console.log(
        `🚀 API Request [${method}]:  ${url}`,
        config.data instanceof FormData ? "(FormData)" : "",
      );

      return config;
    } catch (error) {
      console.error("❌ Request interceptor error:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("❌ Request config error:", error);
    return Promise.reject(error);
  },
);

// ✅ RESPONSE INTERCEPTOR - Handle success, errors, and token expiry
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses
    const method = response.config.method?.toUpperCase() || "UNKNOWN";
    const url =
      response.config.url?.replace(API_BASE_URL, "") || response.config.url;

    console.log(
      `✅ API Success [${response.status}] [${method}]: ${url}`,
      response.data.success ? "✓" : "✗",
    );

    return response;
  },
  async (error: AxiosError) => {
    // Extract error information
    const errorResponse = error.response;
    const errorData = errorResponse?.data as any;
    const status = errorResponse?.status;
    const method = error.config?.method?.toUpperCase() || "UNKNOWN";
    const url =
      error.config?.url?.replace(API_BASE_URL, "") || error.config?.url;

    // ✅ FIX: Handle 401 Unauthorized - Token expired or invalid
    if (status === 401) {
      console.error(
        `⚠️ Token Expired [401] [${method}]: ${url}`,
        errorData?.error || "Unauthorized",
      );

      try {
        // Clear stored credentials
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("user");

        // Clear Authorization header for future requests
        delete api.defaults.headers.common["Authorization"];

        console.log("🔄 Cleared auth data - User needs to login again");
      } catch (err) {
        console.error("❌ Error clearing auth data:", err);
      }

      // Optionally redirect to login - uncomment if using navigation
      // router.push("/(auth)/login");
    }

    // ✅ FIX: Better error logging for all error types
    if (status === 400) {
      console.error(
        `⚠️ Bad Request [400] [${method}]: ${url}`,
        errorData?.error || error.message,
      );
    } else if (status === 403) {
      console.error(
        `⚠️ Forbidden [403] [${method}]: ${url}`,
        errorData?.error || "Access denied",
      );
    } else if (status === 404) {
      console.error(
        `⚠️ Not Found [404] [${method}]: ${url}`,
        errorData?.error || "Resource not found",
      );
    } else if (status === 500) {
      console.error(
        `⚠️ Server Error [500] [${method}]: ${url}`,
        errorData?.error || "Internal server error",
      );
    } else if (error.code === "ECONNABORTED") {
      console.error(
        `⏱️ Request Timeout [${method}]: ${url}`,
        "Request took too long",
      );
    } else if (error.message === "Network Error") {
      console.error(
        `🌐 Network Error [${method}]: ${url}`,
        "Check your internet connection",
      );
    } else {
      console.error(
        `❌ API Error [${status || "Unknown"}] [${method}]:  ${url}`,
        errorData?.error || error.message,
      );
    }

    return Promise.reject(error);
  },
);

// ============ AUTH ENDPOINTS ============

export const authAPI = {
  // Register new user
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
  }) => api.post("/auth/register", data),

  // Login with email and password
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  // Google OAuth login
  googleLogin: (data: {
    google_id: string;
    email: string;
    name: string;
    profile_image?: string;
  }) => api.post("/auth/google-login", data),
};

// ============ SERVICE PROVIDER ENDPOINTS ============

export const serviceProviderAPI = {
  // Register as service provider (FormData with files)
  register: (data: FormData) =>
    api.post("/service-providers/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Get service provider profile
  getProfile: (id: number) => api.get(`/service-providers/${id}`),
};

// ============ SERVICE REQUEST ENDPOINTS ============

export const serviceRequestAPI = {
  // Create new service request (FormData with images)
  create: (data: FormData) =>
    api.post("/service-requests", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Get service request by ID
  getById: (id: number) => api.get(`/service-requests/${id}`),

  // Get all service requests
  getAll: () => api.get("/service-requests"),

  // Get service requests by filter
  getByFilter: (params: Record<string, any>) =>
    api.get("/service-requests", { params }),
};

// ============ QUOTATION ENDPOINTS ============

export const quotationAPI = {
  // Create new quotation
  create: (data: {
    request_id: number;
    amount: number;
    installation_days: number;
    notes?: string;
  }) => api.post("/quotations", data),

  // Get all quotations
  getAll: () => api.get("/quotations"),

  // Get quotation by ID
  getById: (id: number) => api.get(`/quotations/${id}`),
};

// ============ ADMIN ENDPOINTS ============

export const adminAPI = {
  // Get pending service provider registrations
  getPendingProviders: () => api.get("/admin/service-providers/pending"),

  // Approve service provider
  approveProvider: (id: number) =>
    api.post(`/admin/service-providers/${id}/approve`),

  // Reject service provider
  rejectProvider: (id: number, data: { rejection_reason?: string }) =>
    api.post(`/admin/service-providers/${id}/reject`, data),
};

// ============ NOTIFICATION ENDPOINTS ============

export const notificationAPI = {
  // Get all notifications
  getAll: () => api.get("/notifications"),

  // Get notifications with pagination
  getWithPagination: (params: { page?: number; limit?: number }) =>
    api.get("/notifications", { params }),

  // Mark notification as read
  markAsRead: (id: number) => api.put(`/notifications/${id}/read`),

  // Mark all notifications as read
  markAllAsRead: () => api.put("/notifications/mark-all-read"),
};

// ============ SERVICE TYPES ENDPOINTS ============

export const serviceTypeAPI = {
  // Get all service types
  getAll: () => api.get("/service-types"),

  // Get service type by ID
  getById: (id: number) => api.get(`/service-types/${id}`),
};

// ============ UTILITY FUNCTIONS ============

/**
 * Extract error message from API response
 * @param error - Axios error object
 * @returns Error message string
 */
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message === "Network Error") {
    return "Network error.  Please check your internet connection.";
  }

  if (error.code === "ECONNABORTED") {
    return "Request timeout.  Please try again. ";
  }

  return error.message || "An unexpected error occurred.";
};

/**
 * Check if API response is successful
 * @param response - Axios response object
 * @returns Boolean indicating success
 */
export const isSuccess = (response: AxiosResponse): boolean => {
  return response.data?.success === true || response.status < 400;
};

export default api;
