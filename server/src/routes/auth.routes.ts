import express from 'express';
import {authController} from '../controllers/auth.controller';
import {auth} from "../middleware/auth";

const router = express.Router();

// why error?
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/add-follower', auth, authController.addFollower);
router.post('/remove-follower', auth, authController.removeFollower);

// Debug route
router.get('/test', (req, res) => {
    res.json({message: 'Auth routes are working'});
});

export default router;
