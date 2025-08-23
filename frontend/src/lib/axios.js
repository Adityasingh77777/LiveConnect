import axios from "axios";

const isDevelopment = import.meta.env.MODE === "development";

export const axiosInstance = axios.create({
  baseURL: isDevelopment 
    ? "http://localhost:5003/api" 
    : "https://liveconnect-0wp5.onrender.com/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to handle errors
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized, redirecting to login");
      // Clear auth state and redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);