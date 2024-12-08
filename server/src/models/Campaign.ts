// models/Campaign.ts
import mongoose from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

export interface ICampaign extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  cid: number;  // Auto-incrementing campaign ID
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  content: string;  // Full campaign details - visible only to logged in users
  upvotes: mongoose.Types.ObjectId[];
  createdAt: Date;
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
    ref: 'User'
  }]
}, {
  timestamps: true
});

campaignSchema.plugin(AutoIncrement, { inc_field: 'cid' });
export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema);
