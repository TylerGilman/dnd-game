import { Request, Response } from 'express';
import { Campaign } from '../models/Campaign';
import { AuthRequest } from '../middleware/auth';

export const campaignController = {
  async createCampaign(req: AuthRequest, res: Response) {
    console.log('POST /api/campaigns/create', req.body);
    try {
      const { title, description, content } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Must be logged in to create campaigns' });
      }

      const campaign = new Campaign({
        user: userId,
        title,
        description,
        content,
        upvotes: [userId] // Creator automatically upvotes
      });

      await campaign.save();
      res.status(201).json({ campaign });
    } catch (error) {
      console.error('Create campaign error:', error);
      res.status(500).json({ error: 'Failed to create campaign' });
    }
  },

  async getCampaigns(req: AuthRequest, res: Response) {
    console.log('GET /api/campaigns');
    try {
      const campaigns = await Campaign.find()
        .populate('user', 'username')
        .sort({ createdAt: -1 })
        .select(req.user ? '+content' : '-content');

      res.json({ campaigns });
    } catch (error) {
      console.error('Get campaigns error:', error);
      res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
  },

  async getCampaign(req: AuthRequest, res: Response) {
    console.log('GET /api/campaigns/:cid', req.params);
    try {
      const { cid } = req.params;
      const campaign = await Campaign.findOne({ cid })
        .populate('user', 'username')
        .select(req.user ? '+content' : '-content');

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      res.json({ campaign });
    } catch (error) {
      console.error('Get campaign error:', error);
      res.status(500).json({ error: 'Failed to fetch campaign' });
    }
  },

  async upvoteCampaign(req: AuthRequest, res: Response) {
    console.log('POST /api/campaigns/:cid/upvote');
    try {
      const { cid } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Must be logged in to upvote' });
      }

      const campaign = await Campaign.findOne({ cid });
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      const hasUpvoted = campaign.upvotes.includes(userId);
      if (hasUpvoted) {
        campaign.upvotes = campaign.upvotes.filter(id => id.toString() !== userId);
      } else {
        campaign.upvotes.push(userId);
      }

      await campaign.save();
      res.json({ 
        upvoted: !hasUpvoted,
        upvoteCount: campaign.upvotes.length 
      });
    } catch (error) {
      console.error('Upvote campaign error:', error);
      res.status(500).json({ error: 'Failed to upvote campaign' });
    }
  }
};
