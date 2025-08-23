import axios from "axios";

const isDevelopment = import.meta.env.MODE === "development";

// For production, we need to use the same domain as the frontend
// or ensure the backend is accessible from the frontend domain
const getBackendURL = () => {
  if (isDevelopment) {
    return "http://localhost:5003/api";
  }
  
  // Check if we're on the production domain
  if (window.location.hostname === "liveconnect.pages.dev") {
    // Use the render.com backend URL
    return "https://liveconnect-0wp5.onrender.com/api";
  }
  
  // Fallback for other production environments
  return "https://liveconnect-0wp5.onrender.com/api";
};

export const axiosInstance = axios.create({
  baseURL: getBackendURL(),
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🔧 Axios configured with baseURL:", getBackendURL());
console.log("🔧 Frontend hostname:", window.location.hostname);
console.log("🔧 Environment mode:", import.meta.env.MODE);

// Add request interceptor to handle errors
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    console.log("🚀 Request config:", {
      baseURL: config.baseURL,
      withCredentials: config.withCredentials,
      headers: config.headers
    });
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
    console.log("✅ Response received:", {
      status: response.status,
      headers: response.headers,
      cookies: document.cookie
    });
    return response;
  },
  (error) => {
    console.error("❌ Response error:", error);
    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized, redirecting to login");
      // Clear auth state and redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);