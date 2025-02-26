import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config/env.js';

export const generateTokens = (user) => ({
  accessToken: jwt.sign(
    { userId: user._id, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  ),
  refreshToken: jwt.sign(
    { userId: user._id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  )
});

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};