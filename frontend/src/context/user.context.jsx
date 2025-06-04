import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../config/axios'; // Assuming this path is correct

// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // True initially until user status is verified
    const [error, setError] = useState(null);

    // Clear user data
    const clearUser = () => {
        setUser(null);
        // Optionally remove token from localStorage if it's also stored there as a fallback
        // localStorage.removeItem('token'); 
        // Note: axios default headers are not cleared here, but new requests without a user won't be authorized.
    };

    // Check for and handle token refresh
    const handleTokenRefresh = (response) => {
        const refreshedToken = response.headers['x-refreshed-token'];
        if (refreshedToken) {
            console.log('Token was refreshed automatically by the server');
            
            // Store the refreshed token in localStorage for non-cookie fallback
            // Consider if localStorage is your primary token store or just a fallback.
            // If using httpOnly cookies for tokens, this might not be necessary or could be a security consideration.
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
                    
                    // Handle 401 errors globally
                    if (error.response.status === 401) {
                        // If the token has expired and wasn't refreshed, clear user
                        // This check depends on the specific error code/message from your backend
                        const refreshFailed = error.response.data?.code === 'TOKEN_EXPIRED' || 
                                              error.response.data?.message === 'Unauthorized'; // Adjust as per your API
                        if (refreshFailed) {
                            console.log('Token expired or invalid, and refresh might have failed or not applicable. Logging out client-side.');
                            clearUser(); // Clear user state
                            // Optionally, redirect to login page globally here if desired,
                            // though route protection components (UserAuth) will also handle this.
                            // window.location.href = '/login'; // Avoid if using React Router for navigation
                        }
                    }
                }
                return Promise.reject(error);
            }
        );
        
        // Cleanup interceptor on component unmount
        return () => {
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []); // Empty dependency array means this runs once on mount

    // Initialize user state by checking session on component mount
    useEffect(() => {
        const verifyUser = async () => {
            setLoading(true); // Ensure loading is true at the start of verification
            try {
                // Attempt to get user profile, which requires authentication
                const response = await axios.get('/users/profile', {
                    timeout: 10000, // 10 second timeout
                    withCredentials: true // Ensure cookies are sent for session-based authentication
                });
                
                // It's good practice to also call handleTokenRefresh here,
                // in case the initial valid token is about to expire and backend refreshes it.
                handleTokenRefresh(response);
                
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                } else {
                    // If response is not as expected but not an error (e.g., 200 OK with no user)
                    clearUser();
                }
            } catch (error) {
                // console.error('Error verifying user session:', error); // Keep this for debugging
                
                if (error.response) {
                    // console.error('Response data:', error.response.data);
                    // console.error('Response status:', error.response.status);
                    if (error.response.status === 401) {
                        // console.log('User not authenticated (401 during verification).');
                    }
                } else if (error.request) {
                    // console.error('No response received for verifyUser:', error.request);
                } else {
                    // console.error('Request setup error for verifyUser:', error.message);
                }
                
                setError(error.message || 'Failed to verify user session');
                clearUser(); // Ensure user is cleared on any error during verification
            } finally {
                setLoading(false); // Verification attempt finished, set loading to false
            }
        };

        verifyUser();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <UserContext.Provider value={{ user, setUser, clearUser, loading, error, setError }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the user context
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) { // Check for undefined, as null is a valid value for user
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
