import {Response} from 'express';
import {Campaign} from '../models/Campaign';
import {User} from "../models/User";
import {AuthRequest} from "../middleware/auth";
import mongoose from "mongoose";

export const campaignController = {
    async createCampaign(req: AuthRequest, res: Response) {
        try {
            const {title, description, content, isHidden} = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({error: 'You must be logged in to create a campaign.'});
            }

            if (!title || !description || !content) {
                return res.status(400).json({error: 'Title, description, and content are required.'});
            }

            const newCampaign = new Campaign({
                user: userId,
                title,
                description,
                content,
                upvotes: [userId], // Creator automatically upvotes
                isHidden: Boolean(isHidden)
            });

            const savedCampaign = await newCampaign.save();
            res.status(201).json({
                message: 'Campaign created successfully.',
                campaign: savedCampaign
            });
        } catch (error) {
            console.error('Create Campaign error:', error);
            res.status(500).json({error: 'Failed to create campaign'});
        }
    },

    async getCampaign(req: AuthRequest, res: Response) {
        try {
            const {cid} = req.params;
            const userId = req.user?.userId;

            const campaign = await Campaign.findOne({cid})
                .populate('user', 'username');

            if (!campaign) {
                return res.status(404).json({error: 'Campaign not found'});
            }

            // If campaign is hidden and user is not logged in
            if (campaign.isHidden && !userId) {
                return res.status(401).json({error: 'Unauthorized access to hidden campaign'});
            }

            const upvoteCount = campaign.upvotes.length;
            const isUpvoted = userId ? campaign.upvotes.some(id => id.toString() === userId) : false;

            res.json({
                message: 'Campaign retrieved successfully',
                campaign: {
                    ...campaign.toObject(),
                    upvoteCount,
                    isUpvoted
                }
            });
        } catch (error) {
            console.error('Get campaign error:', error);
            res.status(500).json({error: 'Failed to fetch campaign'});
        }
    },

    async getCampaigns(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            const isAuthenticated = !!userId;
            const followingOnly = req.query.followingOnly === 'true';

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

            const campaigns = await Campaign.find(query)
                .sort({createdAt: -1})
                .populate('user', 'username');

            const sanitizedCampaigns = campaigns.map((campaign) => {
                const upvoteCount = campaign.upvotes.length;
                const isUpvoted = isAuthenticated ?
                    campaign.upvotes.some(id => id.toString() === userId) :
                    false;

                return {
                    ...campaign.toObject(),
                    upvoteCount,
                    isUpvoted,
                };
            });

            res.status(200).json({
                message: 'Campaigns retrieved successfully.',
                campaigns: sanitizedCampaigns
            });
        } catch (error) {
            console.error('Get Campaigns error:', error);
            res.status(500).json({error: 'Failed to fetch campaigns'});
        }
    },

    async searchCampaigns(req: AuthRequest, res: Response) {
        try {
            const {query} = req.query;
            if (!query || typeof query !== 'string' || query.trim() === '') {
                return res.status(400).json({error: 'Search query is required.'});
            }

            const userId = req.user?.userId;
            const searchRegex = new RegExp(query, 'i');
            const results = await Campaign.find({
                $or: [
                    {title: {$regex: searchRegex}},
                    {description: {$regex: searchRegex}}
                ]
            }).populate('user', 'username');

            const sanitizedResults = results.map((campaign) => {
                const upvoteCount = campaign.upvotes.length;
                const isUpvoted = userId ?
                    campaign.upvotes.some(id => id.toString() === userId) :
                    false;

                return {
                    ...campaign.toObject(),
                    upvoteCount,
                    isUpvoted,
                };
            });

            res.status(200).json({
                message: 'Search completed successfully.',
                query,
                results: sanitizedResults
            });
        } catch (error) {
            console.error('Search Campaigns error:', error);
            res.status(500).json({error: 'Failed to search campaigns'});
        }
    },

    async updateCampaign(req: AuthRequest, res: Response) {
        try {
            const {cid} = req.params;
            const {title, description, content} = req.body;
            const userId = req.user?.userId;
            console.log(title);
            if (!userId) {
                return res.status(401).json({error: 'Must be logged in.'});
            }

            const campaign = await Campaign.findOne({cid});
            if (!campaign) {
                return res.status(404).json({error: 'Campaign not found.'});
            }

            if (campaign.user.toString() !== userId) {
                return res.status(403).json({error: 'Only the campaign creator can edit.'});
            }

            // Update only the provided fields
            if (title !== undefined) campaign.title = title;
            if (description !== undefined) campaign.description = description;
            if (content !== undefined) campaign.content = content;

            const updatedCampaign = await campaign.save();

            res.status(200).json({
                message: 'Campaign updated successfully.',
                campaign: updatedCampaign
            });
        } catch (error) {
            console.error('Update Campaign error:', error);
            res.status(500).json({error: 'Failed to update campaign'});
        }
    },

    async deleteCampaign(req: AuthRequest, res: Response) {
        try {
            const {cid} = req.params;
            const userId = req.user?.userId;
            const isAdmin = req.user?.isAdmin;

            if (!cid) {
                return res.status(400).json({error: 'Campaign ID is required.'});
            }

            if (!userId) {
                return res.status(401).json({error: 'Must be logged in.'});
            }

            const campaign = await Campaign.findOne({cid});
            if (!campaign) {
                return res.status(404).json({error: 'Campaign not found.'});
            }

            if (campaign.user.toString() !== userId && !isAdmin) {
                return res.status(403).json({error: 'Only the campaign creator or admin can delete.'});
            }

            await Campaign.findByIdAndDelete(campaign._id);
            res.status(200).json({message: 'Campaign deleted successfully.'});
        } catch (error) {
            console.error('Delete Campaign error:', error);
            res.status(500).json({error: 'Failed to delete campaign'});
        }
    },

    async toggleUpvote(req: AuthRequest, res: Response) {
        try {
            const {cid} = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({error: 'Must be logged in to upvote.'});
            }

            const campaign = await Campaign.findOne({cid});
            if (!campaign) {
                return res.status(404).json({error: 'Campaign not found.'});
            }

            const hasUpvoted = campaign.upvotes.some(id => id.toString() === userId);
            if (hasUpvoted) {
                campaign.upvotes = campaign.upvotes.filter(id => id.toString() !== userId);
            } else {
                campaign.upvotes.push(new mongoose.Types.ObjectId(userId));
            }

            await campaign.save();
            res.status(200).json({
                message: hasUpvoted ? 'Upvote removed.' : 'Campaign upvoted.',
                upvoteCount: campaign.upvotes.length
            });
        } catch (error) {
            console.error('Toggle Upvote error:', error);
            res.status(500).json({error: 'Failed to toggle upvote'});
        }
    }
};
