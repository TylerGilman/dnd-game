import {Request, Response} from 'express';
import {AuthRequest} from '../middleware/auth';

export const profileController = {
    async getProfile(req: AuthRequest, res: Response) {
        try {
            const {username} = req.params;

            // TODO

            res.status(200).json({message: 'OK.', username});
        } catch (error) {
            console.error('Get Profile error:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    },

    async updateProfile(req: AuthRequest, res: Response) {
        try {
            const {username} = req.params;
            const userId = req.user?.userId;

            // TODO

            res.status(200).json({message: 'OK.', username, userId});
        } catch (error) {
            console.error('Update Profile error:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    },

    async getProfileFollowers(req: AuthRequest, res: Response) {
        try {
            const {username} = req.params;

            // TODO

            res.status(200).json({message: 'OK.', username});
        } catch (error) {
            console.error('Get Profile Followers error:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }
};
