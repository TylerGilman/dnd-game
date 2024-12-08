import mongoose from 'mongoose';

export interface IComment extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
