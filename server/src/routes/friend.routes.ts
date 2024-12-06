// // server/src/routes/friend.routes.ts
// import express from 'express';
// import { friendController } from '../controllers/friend.controller';
// import { authenticateToken } from '../middleware/auth';
//
// const router = express.Router();
//
// router.use(authenticateToken);
//
// router.post('/request', friendController.sendFriendRequest);
// router.get('/requests', friendController.getFriendRequests);
// router.post('/request/:requestId/accept', friendController.acceptFriendRequest);
// router.post('/request/:requestId/reject', friendController.rejectFriendRequest);
// router.delete('/remove/:friendId', friendController.removeFriend);
// router.get('/search', friendController.searchUsers);
//
// export default router;
