import express from 'express';
import { profileController } from '../controllers/profile.controller';
import {auth, authOptional} from '../middleware/auth';

const router = express.Router();

//@ts-ignore
router.get('/:username', authOptional, profileController.getProfile);
//@ts-ignore
router.post('/:username/update', auth, profileController.updateProfile);
//@ts-ignore
router.get('/:username/followers', auth, profileController.getProfileFollowers);

export default router;
