import mongoose from "mongoose";
// @ts-ignore
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

export interface IPost extends mongoose.Document{
    user: mongoose.Types.ObjectId;
    title: string;
    description: string;
    setup: string;
    upvoteCount: number;
    createdAt: Date;
}

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    setup: {
        type: String,
        required: true
    },
    upvoteCount: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
});

postSchema.plugin(AutoIncrement, { inc_field: 'pid'});
export const Post = mongoose.model<IPost>("Post", postSchema);