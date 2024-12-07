import express from 'express';
import { postController } from '../controllers/post.controller';
import { auth } from '../middleware/auth';

const router = express.Router();
//@ts-ignore
router.post('/create', auth, postController.createPost);
//@ts-ignore
router.get('/:postId', postController.getPost);

router.get('/', postController.getPosts);

router.put('/:postId', auth, postController.updatePost);
//@ts-ignore
router.delete('/:postId', auth, postController.deletePost);

router.post('/:postId/upvote', auth, postController.upvotePost);

export default router;
