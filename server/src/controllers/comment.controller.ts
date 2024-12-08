import {Request, Response} from 'express';
import {Post} from '../models/Post';
import {Comment} from '../models/Comment';
import {AuthRequest} from "../middleware/auth";

export const commentController = {
    async createComment(req: AuthRequest, res: Response) {
        try {
            const {pid, content} = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({error: 'must be logged in.'});
            }
            if (!pid) {
                return res.status(400).json({error: 'pid is required.'});
            }
            if (!content || content.trim() === '') {
                return res.status(400).json({error: 'Comment content cannot be empty.'});
            }
            const post = await Post.findOne({pid}).populate('user', 'username');
            if (!post) {
                return res.status(404).json({error: 'Post not found.'});
            }
            const newComment = new Comment({
                user: userId,
                post: post._id,
                content,
            });
            const savedComment = await newComment.save();

            res.status(201).json({
                message: 'OK.',
                comment: savedComment,
            });
        } catch (error) {
            console.error('Create Comment error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async getCommentsForPost(req: AuthRequest, res: Response) {
        try {
            const {postId} = req.params;
            const userId = req.user?.userId;
            if (!postId) {
                return res.status(400).json({error: 'pid is required.'});
            }
            const post = await Post.findOne({pid: postId});
            if (!post) {
                return res.status(404).json({error: 'Post not found.'});
            }
            if (post.isHidden && !userId) {
                return res.status(401).json({error: 'Unauthorized access to hidden post.'});
            }
            const comments = await Comment.find({post: post._id})
                .sort({createdAt: -1})
                .populate('user', 'username');

            res.status(200).json({
                message: 'OK.',
                comments,
            });
        } catch (error) {
            console.error('Get Comments for Post error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    },

    async updateComment(req: AuthRequest, res: Response) {
        try {
            const {_id, content} = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({error: 'must be logged in.'});
            }
            const comment = await Comment.findById(_id);
            if (!comment) {
                return res.status(404).json({error: 'Comment not found.'});
            }
            if (!comment.user.equals(userId)) {
                return res.status(403).json({error: 'only original commenter can edit comment.'});
            }
            if (!content) {
                res.status(400).json({error: 'Content is required to update the comment.'});
            }
            comment.content = content;
            await comment.save();

            res.status(200).json({message: 'OK.', comment});
        } catch (error) {
            console.error('Update Comment error:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    },

    async deleteComment(req: AuthRequest, res: Response) {
        try {
            const {_id} = req.body;
            const userId = req.user?.userId;
            const isAdmin = req.user?.isAdmin;
            if (!_id) {
                return res.status(400).json({error: 'ned commentId.'});
            }
            if (!userId) {
                return res.status(401).json({error: 'must be logged in.'});
            }
            const comment = await Comment.findById(_id);
            if (!comment) {
                return res.status(404).json({error: 'Comment not found.'});
            }
            if (comment.user.toString() !== userId && !isAdmin) {
                return res.status(403).json({error: 'only original commenter can delete comment.'});
            }
            await Comment.findByIdAndDelete(_id);

            res.status(200).json({message: 'OK.'});
        } catch (error) {
            console.error('Delete Comment error:', error);
            res.status(500).json({error: 'Internal server error.'});
        }
    }
};
