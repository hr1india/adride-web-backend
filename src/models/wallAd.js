import mongoose from 'mongoose';

const wallAdSchema = new mongoose.Schema({
  wallName: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true }, 
  height: { type: Number, required: true },
  breadth: { type: Number, required: true },
  monthlyPrice: { type: Number, required: true },
  availableFrom: { type: String, required: true },
  availableTo: { type: String, required: true },
  isApproved: { 
    type: String, 
    enum: ["approved", "rejected", "pending"], 
    default: "pending" 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
},{ timestamps: true });

export default mongoose.model('WallAd', wallAdSchema);
