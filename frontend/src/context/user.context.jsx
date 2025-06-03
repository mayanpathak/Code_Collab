import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../config/axios';

// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Clear user data and error state
    const clearUser = () => {
        setUser(null);
        setError(null);
        console.log('User data cleared');
    };

    // Check for and handle token refresh
    const handleTokenRefresh = (response) => {
        const refreshedToken = response.headers['x-refreshed-token'];
        if (refreshedToken) {
            console.log('Token was refreshed automatically by the server');
            
            // Store the refreshed token in localStorage for non-cookie fallback
            localStorage.setItem('token', refreshedToken);
            
            // Configure axios to use the refreshed token for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshedToken}`;
        }
    };

    // Setup axios interceptor to check for token refresh header on every response
    useEffect(() => {
        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                // Check if a token was refreshed
                handleTokenRefresh(response);
                return response;
            },
            (error) => {
                // Handle errors but still check for token refresh
                if (error.response) {
                    handleTokenRefresh(error.response);
                    
                    // Handle 401 errors globally - but only for authenticated requests
                    if (error.response.status === 401) {
                        const refreshFailed = error.response.data?.code === 'TOKEN_EXPIRED';
                        if (refreshFailed && user) {
                            // Only clear user if they were previously authenticated
                            console.log('Token expired and refresh failed, logging out');
                            clearUser();
                        }
                    }
                }
                return Promise.reject(error);
            }
        );
        
        // Cleanup
        return () => {
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [user]);

    // Initialize user state by checking session
    useEffect(() => {
        // Verify user session with the server
        const verifyUser = async () => {
            try {
                console.log('Verifying user session...');
                
                // Add timeout to prevent hanging requests
                const response = await axios.get('/users/profile', {
                    timeout: 8000, // 8 second timeout
                    withCredentials: true // Ensure cookies are sent for authentication
                });
                
                // Handle token refresh if provided
                handleTokenRefresh(response);
                
                if (response.data && response.data.user) {
                    console.log('User authenticated:', response.data.user.email || 'Unknown');
                    setUser(response.data.user);
                    setError(null);
                } else {
                    console.log('No user data in response');
                    clearUser();
                }
            } catch (error) {
                // Handle different error scenarios
                if (error.response) {
                    const status = error.response.status;
                    
                    if (status === 401) {
                        // 401 is expected for unauthenticated users - not an error
                        console.log('User not authenticated (expected for new visitors)');
                        clearUser();
                    } else if (status >= 500) {
                        // Server errors
                        console.error('Server error during authentication check:', status);
                        setError('Server error occurred while checking authentication');
                        clearUser();
                    } else {
                        // Other client errors
                        console.error('Authentication check failed:', status, error.response.data);
                        setError('Authentication check failed');
                        clearUser();
                    }
                } else if (error.code === 'ECONNABORTED') {
                    // Timeout error
                    console.error('Authentication check timed out');
                    setError('Connection timeout while checking authentication');
                    clearUser();
                } else if (error.request) {
                    // Network error
                    console.error('Network error during authentication check:', error.message);
                    setError('Network error occurred');
                    clearUser();
                } else {
                    // Request setup error
                    console.error('Request setup error:', error.message);
                    setError('Failed to check authentication');
                    clearUser();
                }
            } finally {
                // Always set loading to false when done
                console.log('Authentication check completed');
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    const contextValue = {
        user,
        setUser,
        clearUser,
        loading,
        error
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the user context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};