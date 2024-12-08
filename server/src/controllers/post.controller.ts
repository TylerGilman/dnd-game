import {Request, Response} from 'express';
import {Post} from '../models/Post';
import {User} from "../models/User";
import {AuthRequest} from "../middleware/auth";
import mongoose from "mongoose";

export const postController = {
    async createPost(req: AuthRequest, res: Response) {
        try {
            const {title, description, setup, isHidden} = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({error: 'You must be logged in to create a post.'});
            }
            if (!title || !description || !setup) {
                return res.status(400).json({error: 'fields are required.'});
            }
            const newPost = new Post({
                user: userId,
                title,
                description,
                setup,
                upvoteBy: [userId],
                isHidden,
            });
            const savedPost = await newPost.save();
            res.status(201).json({
                message: 'OK.',
                post: savedPost
            });
        } catch (error) {
            console.error('Create Post error:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    },

    async getPost(req: AuthRequest, res: Response) {
        try {
            const {pid} = req.params;
            const userId = req.user?.userId;
            if (!pid) {
                return res.status(400).json({error: 'Post ID is required.'});
            }
            const post = await Post.findOne({pid}).populate('user', 'username');
            if (!post) {
                return res.status(404).json({error: 'Post not found.'});
            }
            if (!userId && post.isHidden) {
                return res.status(403).json({error: 'this post restrict access to public'});
            }
            const upvoteCount = post.upvoteBy.length;
            const isUpvoted = userId ? post.upvoteBy.some((id) => id.toString() === userId) : false;
            res.status(200).json({
                message: 'OK.',
                post: {
                    ...post.toObject(),
                    upvoteCount,
                    isUpvoted,
                }
            });
        } catch (error) {
            console.error('Get Post error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async getPosts(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            const isAuthenticated = !!userId;
            const followingOnly = req.body.followingOnly === true;
            let query = {};
            if (!isAuthenticated) {
                query = {isHidden: {$ne: true}};
            } else if (followingOnly) {
                const loggedInUser = await User.findById(userId).select('following');
                if (!loggedInUser) {
                    return res.status(404).json({error: 'User not found.'});
                }
                query = {user: {$in: loggedInUser.following}};
            }
            const posts = await Post.find(query)
                .sort({createdAt: -1})
                .populate('user', 'username')
            const sanitizedPosts = posts.map((post) => {
                const upvoteCount = post.upvoteBy.length;
                const isUpvoted = isAuthenticated ? post.upvoteBy.some((id) => id.toString() === userId) : false;
                return {
                    ...post.toObject(),
                    upvoteCount,
                    isUpvoted,
                };
            });

            res.status(200).json({
                message: 'OK.',
                posts: sanitizedPosts,
            });
        } catch (error) {
            console.error('Get Posts error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async searchPosts(req: AuthRequest, res: Response) {
        try {
            const {query} = req.query;
            if (!query || typeof query !== 'string' || query.trim() === '') {
                return res.status(400).json({error: 'url param:query is required and cannot be empty.'});
            }

            const userId = req.user?.userId;
            const searchRegex = new RegExp(query, 'i');
            const results = await Post.find({
                $or: [
                    {title: {$regex: searchRegex}},
                    {description: {$regex: searchRegex}}
                ]
            }).populate('user', 'username');

            const sanatizedResults = results.map((post) => {
                const upvoteCount = post.upvoteBy.length;
                const isUpvoted = userId ? post.upvoteBy.some((id) => id.toString() === userId) : false;

                return {
                    ...post.toObject(),
                    upvoteCount,
                    isUpvoted,
                };
            });
            res.status(200).json({
                message: 'OK.',
                query,
                results: sanatizedResults
            });
        } catch (error) {
            console.error('Search Posts error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async updatePost(req: AuthRequest, res: Response) {
        try {
            const {pid} = req.params;
            const {description, setup} = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({error: 'must be logged in.'});
            }
            const post = await Post.findOne({pid});
            if (!post) {
                return res.status(404).json({error: 'Post not found.'});
            }
            if (!post.user.equals(userId)) {
                return res.status(403).json({error: 'only original creator can edit'});
            }
            // only the following fields can be changed, for now
            if (description !== undefined) {
                post.description = description;
            }
            if (setup !== undefined) {
                post.setup = setup;
            }
            const updatedPost = await post.save();

            res.status(200).json({
                message: 'OK.',
                post: updatedPost,
            });
        } catch (error) {
            console.error('Update Post error:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    },

    async deletePost(req: AuthRequest, res: Response) {
        try {
            const {pid} = req.params;
            const userId = req.user?.userId;
            const isAdmin = req.user?.isAdmin;
            console.log(userId);
            console.log(isAdmin);
            if (!pid) {
                return res.status(400).json({error: 'need postId'});
            }
            if (!userId) {
                return res.status(401).json({error: 'must be logged in.'});
            }
            const post = await Post.findOne({pid});
            if (!post) {
                return res.status(404).json({error: 'Post not found.'});
            }
            if (post.user.toString() !== userId && !isAdmin) {
                return res.status(403).json({error: 'only original creator and admin can delete'});
            }
            await Post.findByIdAndDelete(post._id);
            res.status(200).json({message: 'OK.'});
        } catch (error) {
            console.error('Delete Post error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async upvotePost(req: AuthRequest, res: Response) {
        try {
            const {pid} = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({error: 'You must be logged in to upvote a post.'});
            }
            if (!pid) {
                return res.status(400).json({error: 'pid is required.'});
            }
            const post = await Post.findOne({pid});
            if (!post) {
                return res.status(404).json({error: 'Post not found.'});
            }
            const hasUpvoted = post.upvoteBy.some(
                (upvoter) => upvoter.toString() === userId
            );
            if (hasUpvoted) {
                post.upvoteBy = post.upvoteBy.filter(
                    (upvoter) => upvoter.toString() !== userId
                );
                await post.save();
                return res.status(200).json({
                    message: 'Upvote removed successfully.',
                    upvoteCount: post.upvoteBy.length
                });
            } else {
                post.upvoteBy.push(new mongoose.Types.ObjectId(userId));
                await post.save();
                return res.status(200).json({
                    message: 'Post upvoted successfully.',
                    upvoteCount: post.upvoteBy.length
                });
            }
        } catch (error) {
            console.error('Upvote Post error:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }
};
