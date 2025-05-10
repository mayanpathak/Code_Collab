import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import { generateResult } from './services/ai.service.js';
import { storeMessage, getMessages, getMessageCount, searchMessages } from './services/message.service.js';
import connect from './db/db.js';
import redisClient from './services/redis.service.js';

const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
    },
    cookie: true,
    allowEIO3: true  // Allow Engine.IO 3 for better compatibility
});

// Centralized error handler
const handleFatalError = (error) => {
    console.error('FATAL ERROR:', error);
    // Quit the process in production, but keep running in development
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
};

// Attempt to connect to MongoDB
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connect();
        console.log('✅ MongoDB connected successfully');

        // Test Redis connection
        await redisClient.raw.ping();
        console.log('✅ Redis connected successfully');

        // Configure Socket.IO middleware
        io.use(async (socket, next) => {
            try {
                // Get token from socket handshake cookies (set by the browser automatically)
                const cookies = socket.handshake.headers.cookie;
                let token = null;
                
                if (cookies) {
                    console.log("Socket handshake has cookies");
                    const cookieArray = cookies.split(';');
                    for (const cookie of cookieArray) {
                        const [name, value] = cookie.trim().split('=');
                        if (name === 'token') {
                            // URL decode the cookie value as it might be encoded
                            token = decodeURIComponent(value);
                            console.log("Found token in cookies");
                            break;
                        }
                    }
                }
                
                // Fallback to authorization header if needed
                if (!token) {
                    console.log("No token in cookies, checking auth header");
                    token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')?.[1];
                }
                
                const projectId = socket.handshake.query.projectId;

                if (!mongoose.Types.ObjectId.isValid(projectId)) {
                    return next(new Error('Invalid projectId'));
                }

                socket.project = await projectModel.findById(projectId);
                socket.projectId = projectId;

                if (!socket.project) {
                    console.warn(`Project with ID ${projectId} not found`);
                }

                if (!token) {
                    console.error("Authentication failed: No token found in cookies or headers");
                    return next(new Error('Authentication error: No token provided'));
                }

                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    console.log("Token verified successfully");
                    socket.user = decoded;
                    next();
                } catch (jwtError) {
                    console.error("JWT verification failed:", jwtError.message);
                    return next(new Error(`Authentication error: ${jwtError.message}`));
                }
            } catch (error) {
                console.error('Socket connection error:', error);
                next(error);
            }
        });

        // Configure Socket.IO connection handling
        io.on('connection', async socket => {
            try {
                socket.roomId = socket.projectId;
                console.log(`User connected to room ${socket.roomId}`);

                socket.join(socket.roomId);

                // Handle loading cached messages
                try {
                    const messageCount = await getMessageCount(socket.roomId);
                    const cachedMessages = await getMessages(socket.roomId, {
                        limit: 100,  // Load last 100 messages initially
                        offset: 0
                    });
                    
                    if (cachedMessages.length > 0) {
                        socket.emit('load-messages', {
                            messages: cachedMessages,
                            totalCount: messageCount
                        });
                    }
                } catch (error) {
                    console.error('Error loading cached messages:', error);
                    socket.emit('error', {
                        type: 'LOAD_MESSAGES_ERROR',
                        message: 'Failed to load message history'
                    });
                }

                // Handle loading more messages
                socket.on('load-more-messages', async ({ offset, limit }) => {
                    try {
                        const olderMessages = await getMessages(socket.roomId, { offset, limit });
                        socket.emit('more-messages-loaded', olderMessages);
                    } catch (error) {
                        console.error('Error loading more messages:', error);
                        socket.emit('error', {
                            type: 'LOAD_MORE_MESSAGES_ERROR',
                            message: 'Failed to load more messages'
                        });
                    }
                });

                // Handle message search
                socket.on('search-messages', async ({ searchTerm }) => {
                    try {
                        const matchingMessages = await searchMessages(socket.roomId, searchTerm);
                        socket.emit('search-results', matchingMessages);
                    } catch (error) {
                        console.error('Error searching messages:', error);
                        socket.emit('error', {
                            type: 'SEARCH_MESSAGES_ERROR',
                            message: 'Failed to search messages'
                        });
                    }
                });

                // Handle project messages
                socket.on('project-message', async data => {
                    try {
                        const message = data.message;

                        // Add timestamp to the message
                        const messageWithTimestamp = {
                            ...data,
                            timestamp: new Date().toISOString()
                        };

                        // Store message in Redis
                        await storeMessage(socket.roomId, messageWithTimestamp);

                        // Forward the user message to everyone in the room
                        socket.broadcast.to(socket.roomId).emit('project-message', messageWithTimestamp);

                        // Check if this is an AI request
                        const aiIsPresentInMessage = message.includes('@ai');
                        if (aiIsPresentInMessage) {
                            // Notify users that AI is processing
                            const processingMessage = {
                                message: JSON.stringify({ 
                                    text: "I'm thinking about your request... This may take a moment."
                                }),
                                sender: {
                                    _id: 'ai',
                                    email: 'AI Assistant'
                                },
                                timestamp: new Date().toISOString()
                            };

                            // Store AI processing message in Redis
                            await storeMessage(socket.roomId, processingMessage);
                            io.to(socket.roomId).emit('project-message', processingMessage);

                            try {
                                // Extract the prompt and validate
                                const prompt = message.replace('@ai', '').trim();
                                if (!prompt) {
                                    throw new Error("Empty prompt");
                                }

                                // Add a specific max timeout for AI generation (45 seconds)
                                let aiResponseReceived = false;
                                const aiResponsePromise = new Promise(async (resolve, reject) => {
                                    const timeoutId = setTimeout(() => {
                                        if (!aiResponseReceived) {
                                            reject(new Error("AI request timed out after 45 seconds"));
                                        }
                                    }, 45000);

                                    try {
                                        const result = await generateResult(prompt);
                                        aiResponseReceived = true;
                                        clearTimeout(timeoutId);
                                        resolve(result);
                                    } catch (error) {
                                        clearTimeout(timeoutId);
                                        reject(error);
                                    }
                                });

                                const result = await aiResponsePromise;
                                const parsedResult = JSON.parse(result);

                                // Ensure the result has the necessary structure
                                if (!parsedResult.text) {
                                    parsedResult.text = `I've processed your request for "${prompt}" but couldn't generate detailed text.`;
                                }

                                const sanitizedResult = JSON.stringify(parsedResult);
                                const aiResponse = {
                                    message: sanitizedResult,
                                    sender: {
                                        _id: 'ai',
                                        email: 'AI Assistant'
                                    },
                                    timestamp: new Date().toISOString()
                                };

                                // Store AI response in Redis
                                await storeMessage(socket.roomId, aiResponse);
                                io.to(socket.roomId).emit('project-message', aiResponse);

                                // Update project file tree if needed
                                if (parsedResult.fileTree && Object.keys(parsedResult.fileTree).length > 0 && socket.project) {
                                    try {
                                        await projectModel.findByIdAndUpdate(
                                            socket.projectId,
                                            { $set: { fileTree: parsedResult.fileTree } },
                                            { new: true }
                                        );
                                        console.log("Updated project with new file tree");
                                    } catch (dbError) {
                                        console.error("Error saving file tree to project:", dbError);
                                        socket.emit('error', {
                                            type: 'UPDATE_FILE_TREE_ERROR',
                                            message: 'Failed to update project file tree'
                                        });
                                    }
                                }
                            } catch (error) {
                                console.error("AI processing error:", error);
                                const errorMessage = {
                                    message: JSON.stringify({
                                        text: `Error: ${error.message}. Please try again with a more specific prompt.`
                                    }),
                                    sender: {
                                        _id: 'ai',
                                        email: 'AI Assistant'
                                    },
                                    timestamp: new Date().toISOString()
                                };

                                await storeMessage(socket.roomId, errorMessage);
                                io.to(socket.roomId).emit('project-message', errorMessage);
                            }
                        }
                    } catch (error) {
                        console.error('Socket message handling error:', error);
                        socket.emit('error', {
                            type: 'MESSAGE_HANDLING_ERROR',
                            message: 'Failed to process message'
                        });
                    }
                });

                socket.on('disconnect', () => {
                    console.log('User disconnected');
                    socket.leave(socket.roomId);
                });
            } catch (error) {
                console.error('Socket connection error:', error);
                socket.emit('error', {
                    type: 'CONNECTION_ERROR',
                    message: 'Failed to establish connection'
                });
            }
        });

        // Start server
        server.listen(port, () => {
            console.log(`✅ Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        handleFatalError(error);
    }
};

// Start server with error handling
startServer().catch(handleFatalError);

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', handleFatalError);
process.on('unhandledRejection', handleFatalError);