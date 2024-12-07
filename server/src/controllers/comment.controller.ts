import {Request, Response} from 'express';
import {Post} from '../models/Post';
import {Comment} from '../models/Comment';
import {AuthRequest} from "../middleware/auth";

export const commentController = {
    async createComment(req: AuthRequest, res: Response) {
        try {
            const {postId} = req.params;
            const {content} = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({error: 'You must be logged in to comment.'});
            }
            if (!postId) {
                return res.status(400).json({error: 'need postId.'});
            }
            if (!content || content.trim() === '') {
                return res.status(400).json({error: 'Comment content cannot be empty.'});
            }
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({error: 'Post not found.'});
            }

            const newComment = new Comment({
                user: userId,
                post: postId,
                content
            });
            const savedComment = await newComment.save();
            res.status(201).json({
                message: 'OK.',
                comment: savedComment
            });
        } catch (error) {
            console.error('Create Comment error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async getCommentsForPost(req: Request, res: Response) {
        try {
            const {postId} = req.params;
            if (!postId) {
                return res.status(400).json({error: 'need postId.'});
            }
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({error: 'Post not found.'});
            }
            const comments = await Comment.find({post: postId})
                .sort({createdAt: -1})
                .populate('user', 'username email');
            res.status(200).json({
                message: 'OK.',
                comments
            });
        } catch (error) {
            console.error('Get Comments for Post error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async updateComment(req: AuthRequest, res: Response) {
        try {
            // TODO
            res.status(200).json({message: 'Not yet implemented. Nothing has changed.'});
        } catch (error) {
            console.error('Update Comment error:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    },

    async deleteComment(req: AuthRequest, res: Response) {
        try {
            const {commentId} = req.params;
            const userId = req.user?.userId;
            const isAdmin = req.user?.isAdmin;
            if (!commentId) {
                return res.status(400).json({error: 'ned commentId.'});
            }
            if (!userId) {
                return res.status(401).json({error: 'You must be logged in to delete a comment.'});
            }
            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({error: 'Comment not found.'});
            }
            if (comment.user.toString() !== userId && !isAdmin) {
                return res.status(403).json({error: 'You are not authorized to delete this comment.'});
            }

            await Comment.findByIdAndDelete(commentId);
            res.status(200).json({message: 'OK.'});
        } catch (error) {
            console.error('Delete Comment error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    }
};
