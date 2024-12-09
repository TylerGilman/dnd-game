import { Response } from 'express';
import { Campaign } from '../models/Campaign'; // Change from Post to Campaign
import { Comment } from '../models/Comment';
import { AuthRequest } from "../middleware/auth";

export const commentController = {
    async createComment(req: AuthRequest, res: Response) {
        try {
            const { cid, content } = req.body;
            const userId = req.user?.userId;
            
            if (!userId) {
                return res.status(401).json({ error: 'Must be logged in.' });
            }
            
            if (!cid) {
                return res.status(400).json({ error: 'Campaign ID is required.' });
            }
            
            if (!content || content.trim() === '') {
                return res.status(400).json({ error: 'Comment content cannot be empty.' });
            }
            
            const campaign = await Campaign.findOne({ cid }).populate('user', 'username');
            if (!campaign) {
                return res.status(404).json({ error: 'Campaign not found.' });
            }
            
            const newComment = new Comment({
                user: userId,
                campaign: campaign._id, // Change post to campaign
                content,
            });
            
            const savedComment = await newComment.save();
            await savedComment.populate('user', 'username');

            res.status(201).json({
                message: 'Comment created successfully.',
                comment: savedComment
            });
        } catch (error) {
            console.error('Create Comment error:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

    async getCommentsForCampaign(req: AuthRequest, res: Response) {
        try {
            const { cid } = req.params;
            const userId = req.user?.userId;
            
            if (!cid) {
                return res.status(400).json({ error: 'Campaign ID is required.' });
            }
            
            const campaign = await Campaign.findOne({ cid });
            if (!campaign) {
                return res.status(404).json({ error: 'Campaign not found.' });
            }
            
            if (campaign.isHidden && !userId) {
                return res.status(401).json({ error: 'Unauthorized access to hidden campaign.' });
            }
            
            const comments = await Comment.find({ campaign: campaign._id })
                .sort({ createdAt: -1 })
                .populate('user', 'username');

            res.status(200).json({
                message: 'Comments retrieved successfully.',
                comments
            });
        } catch (error) {
            console.error('Get Comments error:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

    async updateComment(req: AuthRequest, res: Response) {
        try {
            const { _id, content } = req.body;
            const userId = req.user?.userId;
            
            if (!userId) {
                return res.status(401).json({ error: 'Must be logged in.' });
            }
            
            const comment = await Comment.findById(_id);
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found.' });
            }
            
            if (!comment.user.equals(userId)) {
                return res.status(403).json({ error: 'Only the original commenter can edit this comment.' });
            }
            
            if (!content) {
                return res.status(400).json({ error: 'Content is required to update the comment.' });
            }
            
            comment.content = content;
            await comment.save();

            res.status(200).json({
                message: 'Comment updated successfully.',
                comment
            });
        } catch (error) {
            console.error('Update Comment error:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

  async deleteComment(req: AuthRequest, res: Response) {
      try {
          const { _id } = req.body;
          const userId = req.user?.userId;
          const isAdmin = req.user?.isAdmin;
          
          if (!_id) {
              return res.status(400).json({ error: 'Comment ID is required.' });
          }
          
          if (!userId) {
              return res.status(401).json({ error: 'Must be logged in.' });
          }
          
          // Find the comment and populate the campaign's user field
          const comment = await Comment.findById(_id).populate({
              path: 'campaign',
              select: 'user'
          });

          if (!comment) {
              return res.status(404).json({ error: 'Comment not found.' });
          }

          // Check if user is either comment owner, campaign owner, or admin
          const isCampaignOwner = (comment.campaign as any).user.toString() === userId;
          const isCommentOwner = comment.user.toString() === userId;
          
          if (!isCommentOwner && !isCampaignOwner && !isAdmin) {
              return res.status(403).json({ 
                  error: 'Only the original commenter, campaign owner, or admin can delete this comment.' 
              });
          }
          
          await Comment.findByIdAndDelete(_id);

          res.status(200).json({ message: 'Comment deleted successfully.' });
      } catch (error) {
          console.error('Delete Comment error:', error);
          res.status(500).json({ error: 'Internal server error.' });
      }
  }
};
