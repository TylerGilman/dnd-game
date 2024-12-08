// server/src/routes/auth.routes.ts
import express from 'express';
import { authController } from '../controllers/auth.controller';
import { auth } from "../middleware/auth";

const router = express.Router();

router.post('/register', 
    (req, res) => authController.register(req, res)
);

router.post('/login', 
    (req, res) => authController.login(req, res)
);

router.post('/add-follower', 
    auth,
    (req, res) => authController.addFollower(req, res)
);

router.post('/remove-follower', 
    auth,
    (req, res) => authController.removeFollower(req, res)
);

export default router;
