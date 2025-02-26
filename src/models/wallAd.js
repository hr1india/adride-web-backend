import mongoose from 'mongoose';

const wallAdSchema = new mongoose.Schema({
  wallName: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true }, 
  height: { type: Number, required: true },
  breadth: { type: Number, required: true },
  monthlyPrice: { type: Number, required: true },
  availableFrom: { type: Date, required: true },
  availableTo: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
},{ timestamps: true });

export default mongoose.model('WallAd', wallAdSchema);
