import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.NODE_MODE === "development" ? "http://localhost:5003/api" : "https://liveconnect-0wp5.onrender.com/api",
  withCredentials: true,
});