import mongoose from "mongoose";
// @ts-ignore
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

export interface IPost extends mongoose.Document{
    user: mongoose.Types.ObjectId;
    title: string;
    description: string;
    setup: string;
    upvoteBy: mongoose.Types.ObjectId[];
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
    upvoteBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ]
},{
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.upvoteBy;
            return ret;
        }
    },
    toObject: {
        transform: function (doc, ret) {
            delete ret.upvoteBy;
            return ret;
        }
    }
});

postSchema.plugin(AutoIncrement, { inc_field: 'pid'});
export const Post = mongoose.model<IPost>("Post", postSchema);

