// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// server/src/routes/campaign.routes.ts
import express from 'express';
import { campaignController } from '../controllers/campaign.controller';
import { auth, authOptional } from '../middleware/auth';

const router = express.Router();

router.post('/create', 
    auth,
    (req, res) => campaignController.createCampaign(req, res)
);

router.get('/search', 
    authOptional,
    (req, res) => campaignController.searchCampaigns(req, res)
);

router.get('/', 
    authOptional,
    (req, res) => campaignController.getCampaigns(req, res)
);

router.get('/:cid', 
    authOptional, 
    (req, res) => campaignController.getCampaign(req, res)
);

router.put('/:cid', 
    auth,
    (req, res) => campaignController.updateCampaign(req, res)
);

router.delete('/:cid', 
    auth,
    (req, res) => campaignController.deleteCampaign(req, res)
);

router.post('/:cid/upvote', 
    auth,
    (req, res) => campaignController.toggleUpvote(req, res)
);

export default router;
