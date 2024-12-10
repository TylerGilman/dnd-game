// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// server/src/routes/profile.routes.ts
import express from 'express';
import { profileController } from '../controllers/profile.controller';
import { auth, authOptional } from '../middleware/auth';

const router = express.Router();

router.get('/:username', 
    authOptional,
    (req, res) => profileController.getProfile(req, res)
);

router.post('/:username/update', 
    auth,
    (req, res) => profileController.updateProfile(req, res)
);

router.get('/:username/followers', 
    auth,
    (req, res) => profileController.getProfileFollowers(req, res)
);

export default router;
