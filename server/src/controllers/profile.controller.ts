import {Request, Response} from 'express';
import {AuthRequest} from '../middleware/auth';
import {User} from "../models/User";
import {Post} from "../models/Post";

export const profileController = {
    async getProfile(req: AuthRequest, res: Response) {
        try {
            const {username} = req.params;
            const loggedInUserId = req.user?.userId;
            const user = await User.findOne({username});
            if (!user) {
                return res.status(404).json({error: 'User not found.'});
            }
            let is_following = false;
            let is_follower = false;
            if (loggedInUserId) {
                const loggedInUser = await User.findById(loggedInUserId);
                if (loggedInUser) {
                    is_following = loggedInUser.following.some((id) => id.toString() === user._id.toString());
                    is_follower = user.following.some((id) => id.toString() === loggedInUserId);
                }
            }

            const postQuery = loggedInUserId ? {user: user._id} : {user: user._id, isHidden: {$ne: true}};
            const posts = await Post.find(postQuery).sort({createdAt: -1});

            const profile = {
                username: user.username,
                isAdmin: user.isAdmin,
                email: loggedInUserId ? user.email : undefined,
                tagline: user.tagline,
                numberOfFollowers: user.following.length,
                is_following,
                is_follower,
                posts: posts.map((post) => ({
                    pid: post.pid,
                    title: post.title,
                    description: post.description,
                    createdAt: post.createdAt,
                    upvoteCount: post.upvoteBy.length,
                    isUpvoted: loggedInUserId ? post.upvoteBy.some((id) => id.toString() === loggedInUserId) : false
                })),
            };

            res.status(200).json({message: 'OK.', profile});
        } catch (error) {
            console.error('Get Profile error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async updateProfile(req: AuthRequest, res: Response) {
        try {
            const {username} = req.params;
            const {email, tagline, password} = req.body;
            const loggedInUserId = req.user?.userId;
            const isAdmin = req.user?.isAdmin;
            if (!loggedInUserId) {
                return res.status(401).json({error: 'must be logged in.'});
            }
            const targetUser = await User.findOne({username});
            if (!targetUser) {
                return res.status(404).json({error: 'User not found.'});
            }
            if (!isAdmin && !targetUser._id.equals(loggedInUserId)) {
                return res.status(403).json({error: 'not authorized. either edit your own or if you are admin.'});
            }
            if (email) {
                targetUser.email = email;
            }
            // we do allow empty strings as tagline
            if (tagline !== undefined) {
                targetUser.tagline = tagline;
            }
            if (password) {
                targetUser.password = password;
            }
            await targetUser.save();

            res.status(200).json({message: 'OK.', user: targetUser});
        } catch (error) {
            console.error('Update Profile error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async getProfileFollowers(req: AuthRequest, res: Response) {
        try {
            const {username} = req.params;
            const loggedInUserId = req.user?.userId;
            if (!loggedInUserId) {
                return res.status(401).json({error: 'must be logged in.'});
            }
            const loggedInUser = await User.findById(loggedInUserId);
            if (!loggedInUser) {
                return res.status(401).json({error: 'logged in user not found.'});
            }
            const targetUser = await User.findOne({username}).populate('following', 'username email');
            if (!targetUser) {
                return res.status(404).json({error: 'Target user not found.'});
            }
            const followers = await User.find({following: targetUser._id}, 'username email following');
            const sanatizedFollowers = followers.map((follower) => {
                const is_follower = follower.following.some((id) => id.toString() === loggedInUserId);
                const is_following = loggedInUser.following.some((id) => id.toString() === follower._id.toString());
                return {
                    username: follower.username,
                    _id: follower._id,
                    is_following,
                    is_follower,
                };
            });

            res.status(200).json({
                message: 'OK.',
                followers: sanatizedFollowers,
            });
        } catch (error) {
            console.error('Get Profile Followers error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    }
};
