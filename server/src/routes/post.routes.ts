import express from 'express';
import { postController } from '../controllers/post.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/create', auth, postController.createPost);

router.get('/:postId', postController.getPost);

router.get('/', postController.getPosts);

router.put('/:postId', auth, postController.updatePost);

router.delete('/:postId', auth, postController.deletePost);

router.post('/:postId/upvote', auth, postController.upvotePost);

export default router;
