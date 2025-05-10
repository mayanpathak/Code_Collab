import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../config/axios';

// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Clear user data
    const clearUser = () => {
        setUser(null);
    };

    // Initialize user state by checking session
    useEffect(() => {
        // Verify user session with the server
        const verifyUser = async () => {
            try {
                // Add timeout to prevent hanging requests
                const response = await axios.get('/users/profile', {
                    timeout: 10000, // 10 second timeout
                    withCredentials: true // Ensure cookies are sent for authentication
                });
                console.log("rrrrr",response.data);
                
                
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                } else {
                    clearUser();
                }
            } catch (error) {
                // Improved error handling with specific messages
                console.error('Error verifying user:---', error);
                
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    
                    if (error.response.status === 401) {
                        console.log('User not authenticated');
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('No response received:', error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Request setup error:', error.message);
                }
                
                setError(error.message || 'Failed to verify user');
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, clearUser, loading, error }}>
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