import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  campaignName: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }, 
  location: { type: String, required: true },
  isApproved: { 
    type: String, 
    enum: ["approved", "rejected", "pending"], 
    default: "pending" 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
}, { timestamps: true });

export default mongoose.model('Ad', adSchema);
