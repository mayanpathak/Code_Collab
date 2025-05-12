import userModel from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';
import redisClient from '../services/redis.service.js';


export const createUserController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userService.createUser(req.body);

        const token = await user.generateJWT();

        delete user._doc.password;

        // Set cookie for added security with cross-domain support
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: 'none',
            secure: true,
            path: '/'
        });

        // Log registration success
        console.log(`User registered successfully: ${user.email}`);

        res.status(201).json({ 
            user, 
            token,
            message: 'Registration successful' 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ 
            error: error.message,
            message: 'Registration failed'
        });
    }
}

export const loginController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            })
        }

        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                error: 'Invalid credentials'
            })
        }

        const token = await user.generateJWT();

        delete user._doc.password;

        // Set cookie with consistent cross-domain settings
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: 'none',
            secure: true,
            path: '/'
        });

        // Log login success
        console.log(`User logged in successfully: ${user.email}`);

        res.status(200).json({ 
            user, 
            token,
            message: 'Login successful'
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(400).json({ 
            error: err.message,
            message: 'Login failed'
        });
    }
}

export const profileController = async (req, res) => {
    res.status(200).json({
        user: req.user
    });
}

export const logoutController = async (req, res) => {
    try {
        // Extract token from cookies or authorization header
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')?.[1];
        
        // If we have a token, add it to the blacklist
        if (token) {
            // Use the enhanced Redis client with numeric expiration (24 hours = 86400 seconds)
            await redisClient.set(token, 'logout', 86400);
        }
        
        // Always clear the cookie with matching options
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/'
        });
        
        res.status(200).json({
            message: 'Logged out successfully'
        });
    } catch (err) {
        console.log(err);
        // Even if there's an error, try to clear the cookie
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/'
        });
        res.status(200).json({
            message: 'Logged out'
        });
    }
};

export const getAllUsersController = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            users: allUsers
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}
