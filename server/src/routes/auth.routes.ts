import express from 'express';
import {authController} from '../controllers/auth.controller';
import {auth} from "../middleware/auth";

const router = express.Router();

// @ts-ignore
router.post('/register', authController.register);
// @ts-ignore
router.post('/login', authController.login);
// @ts-ignore
router.post('/add-follower', auth, authController.addFollower);
// @ts-ignore
router.post('/remove-follower', auth, authController.removeFollower);

// Debug route
router.get('/test', (req, res) => {
    res.json({message: 'Auth routes are working'});
});

export default router;
