import axios from "axios";

const BACKEND = import.meta.env.BACKEND_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: BACKEND,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error("API Error:", error);

    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      console.warn("Unauthorized access, redirecting to login...");
      window.location.href = "/login";
    }

    // Reject the promise to allow local error handling
    return Promise.reject(error);
  }
);

export default api;
