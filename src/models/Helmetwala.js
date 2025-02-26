import mongoose from 'mongoose';

const helmetwalaSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
}, { timestamps: true });

export default mongoose.model('Helmetwala', helmetwalaSchema);
