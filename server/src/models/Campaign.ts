import mongoose from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

export interface ICampaign extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    cid: number;
    user: mongoose.Types.ObjectId;
    title: string;
    description: string;
    content: string;
    upvotes: mongoose.Types.ObjectId[];
    isHidden: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const campaignSchema = new mongoose.Schema({
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
    content: {
        type: String,
        required: true
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    isHidden: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.upvotes;
            return ret;
        }
    },
    toObject: {
        transform: function(doc, ret) {
            delete ret.upvotes;
            return ret;
        }
    }
});

campaignSchema.plugin(AutoIncrement, { inc_field: 'cid' });
export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema);
