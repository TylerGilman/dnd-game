import express from 'express';
import {postController} from '../controllers/post.controller';
import {auth, authOptional} from '../middleware/auth';

const router = express.Router();
//@ts-ignore
router.post('/create', auth, postController.createPost);
//@ts-ignore
router.get('/search', authOptional, postController.searchPosts);
//@ts-ignore
router.get('/:pid', authOptional, postController.getPost);
//@ts-ignore
router.get('/', authOptional, postController.getPosts);
//@ts-ignore
router.put('/:pid', auth, postController.updatePost);
//@ts-ignore
router.delete('/:pid', auth, postController.deletePost);
//@ts-ignore
router.post('/:pid/upvote', auth, postController.upvotePost);

export default router;
