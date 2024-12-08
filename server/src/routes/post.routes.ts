import express from 'express';
import { postController } from '../controllers/post.controller';
import { auth } from '../middleware/auth';

const router = express.Router();
//@ts-ignore
router.post('/create', auth, postController.createPost);
//@ts-ignore
router.get('/:pid', postController.getPost);

router.get('/', postController.getPosts);

router.put('/:pid', auth, postController.updatePost);
//@ts-ignore
router.delete('/:pid', auth, postController.deletePost);

router.post('/:pid/upvote', auth, postController.upvotePost);

export default router;
