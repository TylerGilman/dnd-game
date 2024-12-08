import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {config} from '../config/env';

export interface AuthRequest extends Request {
    user?: { userId: string; isAdmin: boolean };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('No authentication token found');
        }
        const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; isAdmin: boolean };
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({error: 'Please authenticate'});
    }
};

export const authOptional = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return next();
        }
        const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; isAdmin: boolean };
        req.user = decoded; // Attach user details to req.user if authenticated
    } catch (error) {
        console.warn('OptionalAuth: Invalid or missing token, proceeding unauthenticated');
    }
    next();
};
