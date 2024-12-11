import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {User} from '../models/User';
import {config} from '../config/env';
import {AuthRequest} from "../middleware/auth";

// TODO: input validation

export const authController = {
    async register(req: Request, res: Response) {
        try {
            const {username, email, password, adminPassphrase} = req.body;

            const usernameRegex = /^[a-zA-Z0-9]+$/;
            if (!usernameRegex.test(username)) {
                return res.status(400).json({
                    error: 'Username can only be alphanumeric'
                });
            }

            const existingUser = await User.findOne({
                $or: [{email}, {username}]
            });

            if (existingUser) {
                return res.status(400).json({
                    error: 'Username or email already exists'
                });
            }

            const user = new User({
                username,
                email,
                password,
                isAdmin: adminPassphrase === 'abracadabra',
            });
            await user.save();

            // Generate token
            const token = jwt.sign(
                {
                    userId: user._id,
                    isAdmin: user.isAdmin,
                },
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
                {
                    userId: user._id,
                    isAdmin: user.isAdmin,
                },
                config.jwtSecret,
                {expiresIn: '24h'}
            );

            // Return user (without password) and token
            const {password: _, ...userResponse} = user.toObject();
            res.json({user: userResponse, token});
        } catch (error) {
            console.error('Login error:', error);
            res.status(400).json({error: (error as Error).message});
        }
    },

    async addFollower(req: AuthRequest, res: Response) {
        try {
            const {username} = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({error: 'You must be logged in to perform this action.'});
            }
            if (!username) {
                return res.status(400).json({error: 'Username is required.'});
            }
            const user = await User.findById(userId);
            const targetUser = await User.findOne({username});
            if (!user || !targetUser) {
                return res.status(404).json({error: 'Either or both user not found.'});
            }
            if (user._id.equals(targetUser._id)) {
                return res.status(400).json({error: 'cannot follow yourself.'});
            }
            if (user.following.some((id) => id.equals(targetUser._id))) {
                return res.status(400).json({error: 'already following.'});
            }
            user.following.push(targetUser._id);
            await user.save();

            res.status(200).json({message: 'OK.', following: user.following});
        } catch (error) {
            console.error('Add Follower error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async removeFollower(req: AuthRequest, res: Response) {
        try {
            const {username} = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({error: 'You must be logged in to perform this action.'});
            }
            if (!username) {
                return res.status(400).json({error: 'Username is required.'});
            }
            const user = await User.findById(userId);
            const targetUser = await User.findOne({username});
            if (!user || !targetUser) {
                return res.status(404).json({error: 'Either or both user not found.'});
            }
            if (user._id.equals(targetUser._id)) {
                return res.status(400).json({error: 'cannot unfollow yourself.'});
            }
            if (!user.following.some((id) => id.equals(targetUser._id))) {
                return res.status(400).json({error: 'not following.'});
            }
            user.following = user.following.filter((id) => !id.equals(targetUser._id));
            await user.save();

            res.status(200).json({message: 'OK.', following: user.following});
        } catch (error) {
            console.error('Remove Follower error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    }
};

