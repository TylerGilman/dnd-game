import mongoose from 'mongoose';

export interface IComment extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    campaign: mongoose.Types.ObjectId; // Change from post to campaign
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
    campaign: {  // Change from post to campaign
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
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
