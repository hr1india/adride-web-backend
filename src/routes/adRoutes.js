import express from 'express';
import { isAuthenticated, hasRole } from '../middlewares/authMiddleware.js';
import { createAd, getAds, getMyAds, editAd, deleteAd, approveAd, rejectAd } from '../controllers/adController.js';
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/create', isAuthenticated, hasRole('advertiser'), upload.single('image'), createAd);

router.get('/', getAds);

router.get('/my-ads', isAuthenticated, hasRole('advertiser'), getMyAds);

router.put('/edit/:id', isAuthenticated, hasRole('advertiser'), upload.single('image'), editAd);

router.delete('/delete/:id', isAuthenticated, hasRole('advertiser'), deleteAd);
router.put('/:id/active',approveAd);
router.put('/:id/inactive',rejectAd);


router.post("/buy/create-order", isAuthenticated,hasRole('advertiser'), createOrder);
router.post("/buy/verify-payment", isAuthenticated,hasRole('advertiser'), verifyPayment);

export default router;
