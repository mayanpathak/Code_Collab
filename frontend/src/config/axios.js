import axios from 'axios';
import { API_URL } from './config';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Enable sending cookies with requests
    timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // No need to manually set token in headers when using cookies
        // The "withCredentials: true" setting will automatically include cookies
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error - server may be down:', error);
            // You can dispatch a custom event to show a global error
            window.dispatchEvent(new CustomEvent('api_error', { 
                detail: { 
                    type: 'NETWORK_ERROR',
                    message: 'Unable to connect to the server. Please check if the server is running.' 
                } 
            }));
        } else if (error.response?.status === 401) {
            // Handle unauthorized errors (expired token, etc.)
            if (error.response.data?.code === 'TOKEN_EXPIRED') {
                // Dispatch an event to handle logout
                window.dispatchEvent(new CustomEvent('auth_error', { 
                    detail: { 
                        type: 'TOKEN_EXPIRED',
                        message: 'Your session has expired. Please log in again.' 
                    } 
                }));
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;   