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

        // Set cookie for added security
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'none',
            secure: true,
            path: '/'
        });

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
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

        // Set cookie for added security
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'lax',
            path: '/'
        });

        res.status(200).json({ user, token });


    } catch (err) {

        console.log(err);

        res.status(400).send(err.message);
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
            sameSite: 'lax',
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
            sameSite: 'lax',
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
