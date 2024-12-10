// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import express from 'express';
import { commentController } from '../controllers/comment.controller';
import { auth, authOptional } from '../middleware/auth';

const router = express.Router();

// Explicitly define the callback functions
router.post('/create', 
    auth,
    (req, res) => commentController.createComment(req, res)
);

router.get('/campaign/:cid', 
    authOptional,
    (req, res) => commentController.getCommentsForCampaign(req, res)
);

router.put('/update', 
    auth,
    (req, res) => commentController.updateComment(req, res)
);

router.delete('/delete', 
    auth,
    (req, res) => commentController.deleteComment(req, res)
);

export default router;
