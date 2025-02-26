import express from 'express';
import { isAuthenticated, isWallOwner } from '../middlewares/wallOwnerMiddleware.js';
import { createWallAd, getAllWallAds, getAllWallById, editWallAd, deleteWallAd,changeWallAdStatus,getMyWallAds } from '../controllers/wallAdController.js';
import upload from '../middlewares/upload.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/create', isAuthenticated, isWallOwner, upload.single('image'), createWallAd);
router.get('/', getAllWallAds);
router.get('/:id', getAllWallById);
router.get('/my-walls', isAuthenticated, isWallOwner, getMyWallAds);
router.put('/edit/:id', isAuthenticated, isWallOwner, upload.single('image'), editWallAd);
router.delete('/delete/:id', isAuthenticated, isWallOwner, deleteWallAd);
router.put('/change-status/:id', isAuthenticated, isAdmin ,changeWallAdStatus );

export default router;