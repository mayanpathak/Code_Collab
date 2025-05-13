import axios from "axios";
import { API_URL } from "./config";

// Create axios instance with improved configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable sending cookies with requests
  timeout: 30000, // 30 seconds timeout (increased from 15s)
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Log API URL for debugging
console.log('API URL in axios config:', API_URL);

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage as fallback
    const token = localStorage.getItem("authToken");

    // If token exists, add it to headers as fallback
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Log outgoing request details for debugging (in development)
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    // If response includes a token, save it to localStorage
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    // Check for token refresh header
    const refreshedToken = response.headers['x-refreshed-token'];
    if (refreshedToken) {
      localStorage.setItem('authToken', refreshedToken);
      console.log('Token refreshed from header');
    }
    
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout error:", error);
      
      // Show timeout specific error
      window.dispatchEvent(
        new CustomEvent("api_error", {
          detail: {
            type: "TIMEOUT_ERROR",
            message: "The server is taking too long to respond. Please try again later or check your connection.",
          },
        })
      );
      
      // Handle login/register timeouts specially to avoid confusing the user
      if (window.location.pathname === '/login' || window.location.pathname === '/register') {
        window.dispatchEvent(
          new CustomEvent("auth_form_error", {
            detail: {
              message: "Connection to server timed out. Please try again or check if the server is running.",
            },
          })
        );
      }
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error - server may be down:", error);
      
      // You can dispatch a custom event to show a global error
      window.dispatchEvent(
        new CustomEvent("api_error", {
          detail: {
            type: "NETWORK_ERROR",
            message:
              "Unable to connect to the server. Please check your internet connection.",
          },
        })
      );
    } else if (error.response) {
      // Log the detailed error for debugging
      console.error(`API Error ${error.response.status}:`, error.response.data);
      
      // Handle status-specific errors
      if (error.response.status === 401) {
        // Handle unauthorized errors (expired token, etc.)
        window.dispatchEvent(
          new CustomEvent("auth_error", {
            detail: {
              type: "AUTH_ERROR",
              code: error.response.data?.code || "UNAUTHORIZED",
              message: error.response.data?.message || 
                "Your session has expired. Please log in again.",
            },
          })
        );
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      } else if (error.response.status === 404) {
        window.dispatchEvent(
          new CustomEvent("api_error", {
            detail: {
              type: "NOT_FOUND",
              message: "The requested resource was not found.",
            },
          })
        );
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
