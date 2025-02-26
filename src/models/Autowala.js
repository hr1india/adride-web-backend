import mongoose from 'mongoose';

const autowalaSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true }, 
  imageUrl: { type: String, required: true }, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
}, { timestamps: true });

export default mongoose.model('Autowala', autowalaSchema);
