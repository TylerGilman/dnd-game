// commenting off now for requirement changes

// // server/src/controllers/friend.controller.ts
// import {Request, Response} from 'express';
// import {User} from '../models/User';
// import {FriendRequest} from '../models/FriendRequest';
//
// export const friendController = {
//     async sendFriendRequest(req: Request, res: Response) {
//         try {
//             const {recipientId} = req.body;
//             const senderId = req.user.id;
//
//             // Check if request already exists
//             const existingRequest = await FriendRequest.findOne({
//                 sender: senderId,
//                 recipient: recipientId,
//                 status: 'pending'
//             });
//
//             if (existingRequest) {
//                 return res.status(400).json({message: 'Friend request already sent'});
//             }
//
//             // Check if they're already friends
//             const sender = await User.findById(senderId);
//             if (sender.friends.includes(recipientId)) {
//                 return res.status(400).json({message: 'Already friends'});
//             }
//
//             const newRequest = await FriendRequest.create({
//                 sender: senderId,
//                 recipient: recipientId
//             });
//
//             res.status(201).json(newRequest);
//         } catch (error) {
//             res.status(500).json({message: 'Error sending friend request', error});
//         }
//     },
//
//     async getFriendRequests(req: Request, res: Response) {
//         try {
//             const requests = await FriendRequest.find({
//                 recipient: req.user.id,
//                 status: 'pending'
//             }).populate('sender', 'username');
//
//             res.json(requests);
//         } catch (error) {
//             res.status(500).json({message: 'Error getting friend requests', error});
//         }
//     },
//
//     async acceptFriendRequest(req: Request, res: Response) {
//         try {
//             const {requestId} = req.params;
//             const request = await FriendRequest.findById(requestId);
//
//             if (!request) {
//                 return res.status(404).json({message: 'Request not found'});
//             }
//
//             // Add each user to the other's friends list
//             await User.findByIdAndUpdate(request.sender, {
//                 $addToSet: {friends: request.recipient}
//             });
//             await User.findByIdAndUpdate(request.recipient, {
//                 $addToSet: {friends: request.sender}
//             });
//
//             request.status = 'accepted';
//             await request.save();
//
//             res.json({message: 'Friend request accepted'});
//         } catch (error) {
//             res.status(500).json({message: 'Error accepting friend request', error});
//         }
//     },
//
//     async rejectFriendRequest(req: Request, res: Response) {
//         try {
//             const {requestId} = req.params;
//             await FriendRequest.findByIdAndUpdate(requestId, {status: 'rejected'});
//             res.json({message: 'Friend request rejected'});
//         } catch (error) {
//             res.status(500).json({message: 'Error rejecting friend request', error});
//         }
//     },
//
//     async removeFriend(req: Request, res: Response) {
//         try {
//             const {friendId} = req.params;
//             const userId = req.user.id;
//
//             // Remove from both users' friend lists
//             await User.findByIdAndUpdate(userId, {
//                 $pull: {friends: friendId}
//             });
//             await User.findByIdAndUpdate(friendId, {
//                 $pull: {friends: userId}
//             });
//
//             res.json({message: 'Friend removed'});
//         } catch (error) {
//             res.status(500).json({message: 'Error removing friend', error});
//         }
//     },
//
//     async searchUsers(req: Request, res: Response) {
//         try {
//             const {query} = req.query;
//             const users = await User.find({
//                 username: new RegExp(query as string, 'i'),
//                 _id: {$ne: req.user.id}
//             }).select('username');
//             res.json(users);
//         } catch (error) {
//             res.status(500).json({message: 'Error searching users', error});
//         }
//     }
// };
