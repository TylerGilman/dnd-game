import {Request, Response} from 'express';
import {Post} from '../models/Post';
import {AuthRequest} from "../middleware/auth";

export const postController = {
    async createPost(req: AuthRequest, res: Response) {
        try {
            const {title, description, setup} = req.body;
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
                upvoteCount: 0
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

    async getPost(req: Request, res: Response) {
        try {
            const {pid} = req.params;
            if (!pid) {
                return res.status(400).json({error: 'Post ID is required.'});
            }
            const post = await Post.findOne({pid}).populate('user', 'username email');
            if (!post) {
                return res.status(404).json({error: 'Post not found.'});
            }
            res.status(200).json({
                message: 'OK.',
                post
            });
        } catch (error) {
            console.error('Get Post error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async getPosts(req: Request, res: Response) {
        try {
            const pageParam = parseInt(req.query.page as string, 10);
            const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
            const limit = 8;
            const skip = (page - 1) * limit;
            const totalPosts = await Post.countDocuments();
            const totalPages = Math.ceil(totalPosts / limit);
            const currentPage = page > totalPages ? 1 : page;

            const posts = await Post.find()
                .sort({createdAt: -1})
                .skip((currentPage - 1) * limit)
                .limit(limit)
                .populate('user', 'username email');

            res.status(200).json({
                message: 'OK.',
                currentPage,
                totalPages,
                posts
            });
        } catch (error) {
            console.error('Get Posts error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async searchPosts(req: Request, res: Response) {
        try {
            const {query} = req.query;
            if (!query || typeof query !== 'string' || query.trim() === '') {
                return res.status(400).json({error: 'Search query is required and cannot be empty.'});
            }
            const searchRegex = new RegExp(query, 'i');
            const results = await Post.find({
                $or: [
                    {title: {$regex: searchRegex}},
                    {description: {$regex: searchRegex}}
                ]
            }).populate('user', 'username email');
            res.status(200).json({
                message: 'SOK.',
                query,
                results
            });
        } catch (error) {
            console.error('Search Posts error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async updatePost(req: AuthRequest, res: Response) {
        try {
            const {pid} = req.params;
            const userId = req.user?.userId;
            // TODO
            res.status(200).json({message: 'not yet implemented. nothing changed', pid, userId});
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
                return res.status(401).json({error: 'You must be logged in to delete a post.'});
            }
            const post = await Post.findOne({pid});
            if (!post) {
                return res.status(404).json({error: 'Post not found.'});
            }
            if (post.user.toString() !== userId && !isAdmin) {
                return res.status(403).json({error: 'You are not authorized to delete this post.'});
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
            // TODO
            res.status(200).json({message: 'not yet implemented. nothing changed', pid, userId});
        } catch (error) {
            console.error('Upvote Post error:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }
};
