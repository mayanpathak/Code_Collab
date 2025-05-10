import io from 'socket.io-client';
import { API_URL } from './config';

let socket = null;

/**
 * Initialize a socket connection for a specific project
 * @param {string} projectId - The ID of the project to connect to
 * @returns {object} - The socket instance
 */
export const initializeSocket = (projectId) => {
    try {
        if (socket) {
            // If we have a previous connection, clean it up first
            cleanupSocket();
        }

        // Create new socket connection with auth via cookies and project ID
        socket = io(API_URL, {
            withCredentials: true, // Enable sending cookies    
            query: {
                projectId: projectId
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 15000
        });

        // Set up connection event handlers
        socket.on('connect', () => {
            console.log('Socket connected successfully');
            window.socket = socket;
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            // Show error in UI if needed
            if (window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('socket_error', { 
                    detail: { 
                        type: 'CONNECT_ERROR',
                        message: 'Failed to connect to the server. Please check if you are logged in.' 
                    } 
                }));
            }
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            if (reason === 'io server disconnect') {
                // Server disconnected us, try to reconnect
                socket.connect();
            }
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
            // Show error in UI
            if (window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('socket_error', { 
                    detail: error 
                }));
            }
        });

        window.socket = socket;
        return socket;
    } catch (error) {
        console.error('Error initializing socket:', error);
        return null;
    }
};

/**
 * Send a message via the socket connection
 * @param {string} event - The event name to emit
 * @param {object} data - The data to send
 * @returns {boolean} - Whether the message was sent successfully
 */
export const sendMessage = (event, data) => {
    try {
        if (!socket || !socket.connected) {
            console.error('Cannot send message: Socket not connected');
            return false;
        }

        socket.emit(event, data);
        return true;
    } catch (error) {
        console.error('Error sending message:', error);
        return false;
    }
};

/**
 * Set up a callback for receiving messages of a specific event type
 * @param {string} event - The event name to listen for
 * @param {function} callback - The callback function to execute when the event is received
 */
export const receiveMessage = (event, callback) => {
    try {
        if (!socket) {
            console.error('Cannot receive messages: Socket not initialized');
            return;
        }

        // Remove any existing listeners for this event
        socket.off(event);
        
        // Add the new listener
        socket.on(event, (data) => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in ${event} callback:`, error);
            }
        });
    } catch (error) {
        console.error('Error setting up message receiver:', error);
    }
};

/**
 * Clean up the socket connection and event listeners
 */
export const cleanupSocket = () => {
    try {
        if (socket) {
            // Remove all listeners and disconnect
            socket.removeAllListeners();
            socket.disconnect();
            socket = null;
            window.socket = null;
        }
    } catch (error) {
        console.error('Error cleaning up socket:', error);
    }
};

export default { initializeSocket, sendMessage, receiveMessage, cleanupSocket };