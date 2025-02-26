import Stripe from 'stripe';
import Razorpay from 'razorpay';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});