import express from 'express';
import { commentController } from '../controllers/comment.controller';
import { auth, authOptional } from '../middleware/auth';

const router = express.Router();


//@ts-ignore
router.post('/create', auth, commentController.createComment);
//@ts-ignore
router.get('/:postId', authOptional, commentController.getCommentsForPost);
//@ts-ignore
router.put('/', auth, commentController.updateComment);
//@ts-ignore
router.delete('/', auth, commentController.deleteComment);

export default router;
