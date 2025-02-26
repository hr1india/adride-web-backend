import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateTokens } from '../utils/jwt.js';

export const registerUser = async (email, password, role) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already exists');
  
  const user = await User.create({ email, password, role });
  const tokens = generateTokens(user);
  user.refreshTokens.push(tokens.refreshToken);
  await user.save();
  return tokens;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  const tokens = generateTokens(user);
  user.refreshTokens.push(tokens.refreshToken);
  await user.save();
  return tokens;
};