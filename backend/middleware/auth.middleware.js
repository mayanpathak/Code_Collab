import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
import User from '../models/user.model.js';
import Project from '../models/project.model.js';
import { getProjectById } from '../services/project.service.js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded with appropriate path
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

// Improved token extraction function
const extractToken = (req) => {
    // Check Authorization header first (Bearer token)
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.replace('Bearer ', '');
    }
    
    // Then check cookies
    if (req.cookies && req.cookies.token) {
        return req.cookies.token;
    }
    
    // Finally check if token is in request body (not recommended but sometimes used)
    if (req.body && req.body.token) {
        return req.body.token;
    }
    
    // Log what we received for debugging
    console.log('[Auth Debug] Headers:', JSON.stringify(req.headers));
    console.log('[Auth Debug] Cookies exist:', !!req.cookies);
    
    return null;
};

export const authUser = async (req, res, next) => {
    try {
        // Verify JWT secret is configured
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET environment variable is not set!');
            return res.status(500).json({
                status: 'error',
                message: 'Server misconfiguration - contact administrator'
            });
        }
        
        // Extract token using the improved function
        const token = extractToken(req);
        
        // Log token existence (not the actual token) for debugging
        console.log('[Auth Debug] Token found:', !!token);
        console.log('[Auth Debug] Environment:', process.env.NODE_ENV);
        
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authorized, no token provided'
            });
        }
        
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (tokenError) {
            if (tokenError.name === 'TokenExpiredError') {
                // Token expired - try to refresh it if we can identify the user
                try {
                    // Extract data without verification to find the user
                    const expiredDecoded = jwt.decode(token);
                    if (expiredDecoded && expiredDecoded.email) {
                        // Find user by email
                        const user = await User.findOne({ email: expiredDecoded.email }).select('-password');
                        
                        if (user) {
                            // User found - generate new token
                            const newToken = await user.generateJWT();
                            
                            // Set the new token in cookie
                            res.cookie('token', newToken, {
                                httpOnly: true,
                                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                                secure: true,
                                path: '/'
                            });
                            
                            // Set user in the request and continue
                            req.user = user;
                            console.log('[Auth] Successfully refreshed expired token');
                            
                            // Set refreshed token header so client can update
                            res.set('X-Refreshed-Token', newToken);
                            
                            // Continue to the route handler
                            return next();
                        }
                    }
                } catch (refreshError) {
                    console.error('[Auth] Token refresh failed:', refreshError);
                }
                
                // If we reach here, refresh failed
                return res.status(401).json({
                    status: 'error',
                    message: 'Your session has expired. Please log in again.',
                    code: 'TOKEN_EXPIRED'
                });
            }
            
            if (tokenError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid token. Please log in again.',
                    code: 'INVALID_TOKEN'
                });
            }
            
            throw tokenError;
        }
        
        if (!decoded) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid token'
            });
        }
        
        const user = await User.findOne({ email: decoded.email }).select('-password');
        
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found'
            });
        }
        
        req.user = user;
        
        // Check if this is a project-related route and load project data
        const projectIdParam = req.params.projectId;
        if (projectIdParam) {
            try {
                // Load project data for validation
                const project = await Project.findById(projectIdParam);
                
                if (!project) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Project not found'
                    });
                }
                
                // Check if user has access to the project
                const hasAccess = project.users.some(
                    userId => userId.toString() === user._id.toString()
                );
                
                if (!hasAccess) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'You do not have access to this project'
                    });
                }
                
                // Attach project to request for use in controllers
                req.project = project;
            } catch (error) {
                console.error('Error validating project access:', error);
                return res.status(500).json({
                    status: 'error',
                    message: 'Error validating project access'
                });
            }
        }
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};