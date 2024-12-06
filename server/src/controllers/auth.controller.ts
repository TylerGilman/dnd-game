import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {User} from '@/models/User';
import {config} from '@/config/env';

// TODO: input validation

export const authController = {
    async register(req: Request, res: Response) {
        try {
            const {username, email, password} = req.body;

            // Check if user exists
            const existingUser = await User.findOne({
                $or: [{email}, {username}]
            });

            if (existingUser) {
                return res.status(400).json({
                    error: 'Username or email already exists'
                });
            }

            // Create new user
            const user = new User({username, email, password});
            await user.save();

            // Generate token
            const token = jwt.sign(
                {userId: user._id},
                config.jwtSecret,
                {expiresIn: '24h'}
            );

            // Return user (without password) and token
            const {password: _, ...userResponse} = user.toObject();
            res.status(201).json({user: userResponse, token});
        } catch (error) {
            console.error('Register error:', error);
            res.status(400).json({error: (error as Error).message});
        }
    },

    async login(req: Request, res: Response) {
        try {
            const {email, password} = req.body;

            // Find user
            const user = await User.findOne({email});
            if (!user) {
                return res.status(401).json({error: 'Invalid credentials'});
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({error: 'Invalid credentials'});
            }

            // Generate token
            const token = jwt.sign(
                {userId: user._id},
                config.jwtSecret,
                {expiresIn: '24h'}
            );

            // Return user (without password) and token
            const {password: _, ...userResponse} = user.toObject()
            res.json({user: userResponse, token});
        } catch (error) {
            console.error('Login error:', error);
            res.status(400).json({error: (error as Error).message});
        }
    }
};
