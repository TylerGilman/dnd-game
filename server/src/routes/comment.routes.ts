import express from 'express';
import { commentController } from '../controllers/comment.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/:postId/create', auth, commentController.createComment);

router.get('/:postId', commentController.getCommentsForPost);

router.put('/:commentId', auth, commentController.updateComment);

router.delete('/:commentId', auth, commentController.deleteComment);

export default router;
