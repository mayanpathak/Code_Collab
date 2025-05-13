/**
 * Application configuration
 */

// API URL from environment or fallback
// Replace 'http://localhost:3000' with your actual deployed backend URL
export const API_URL = import.meta.env.VITE_API_URL || 'https://soen-main-backend.vercel.app';

// Log the API URL to help with debugging
console.log('API URL:', API_URL);

// Default message pagination
export const DEFAULT_MESSAGE_LIMIT = 100;

// Other configuration constants
export const APP_NAME = 'CodeCollab';
export const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
export const MAX_MESSAGE_LENGTH = 5000; // 5000 characters max per message
export const MESSAGE_SEARCH_DELAY = 300; // 300ms delay for search input

// Error messages
export const ERROR_MESSAGES = {
    SOCKET_CONNECTION: 'Unable to connect to the server. Please check your internet connection.',
    AUTHENTICATION: 'Authentication failed. Please log in again.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    DEFAULT: 'An error occurred. Please try again later.'
};

export default {
    API_URL,
    DEFAULT_MESSAGE_LIMIT,
    APP_NAME,
    SESSION_TIMEOUT,
    MAX_MESSAGE_LENGTH,
    MESSAGE_SEARCH_DELAY,
    ERROR_MESSAGES
}; 