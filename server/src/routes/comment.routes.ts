import express from 'express';
import { commentController } from '../controllers/comment.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

//@ts-ignore
router.post('/:postId/create', auth, commentController.createComment);
//@ts-ignore
router.get('/:postId', commentController.getCommentsForPost);

router.put('/:commentId', auth, commentController.updateComment);
//@ts-ignore
router.delete('/:commentId', auth, commentController.deleteComment);

export default router;
