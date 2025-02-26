import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const seedAdmin = async () => {
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    await User.create({
      email: 'admin@adride.com',
      password: await bcrypt.hash('admin123', 12),
      role: 'admin'
    });
  }
};