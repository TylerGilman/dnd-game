import express from 'express';
import { authController } from '../controllers/auth.controller';

const router = express.Router();

// why error?
router.post('/register', authController.register);
router.post('/login', authController.login);

// Debug route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working' });
});

export default router;
