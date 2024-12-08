import express from 'express';
import { campaignController } from '../controllers/campaign.controller';
import { auth, authOptional } from '../middleware/auth';

const router = express.Router();

router.post('/create', auth, campaignController.createCampaign);
router.get('/', authOptional, campaignController.getCampaigns);
router.get('/:cid', authOptional, campaignController.getCampaign);
router.post('/:cid/upvote', auth, campaignController.upvoteCampaign);

export default router;
