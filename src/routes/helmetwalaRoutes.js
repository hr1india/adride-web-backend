import express from 'express';
import { isAuthenticated, isHelmetwala } from '../middlewares/automiddleware.js';
import { createHelmetwalaAd, getAllHelmetwalaAds, getMyHelmetwalaAds, editHelmetwalaAd, deleteHelmetwalaAd, changeHelmetwalaAdStatus, getAllApprovedHelmetwalaAds, getAllRejectedHelmetwalaAds, getAllPendingHelmetwalaAds  } from '../controllers/helmetwalaController.js';
import upload from '../middlewares/upload.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/create', isAuthenticated, isHelmetwala, upload.single('image'), createHelmetwalaAd);

router.get('/', getAllHelmetwalaAds);
router.get('/ads/approved', getAllApprovedHelmetwalaAds);
router.get('/ads/rejected', getAllRejectedHelmetwalaAds);
router.get('/ads/pending', getAllPendingHelmetwalaAds);

router.get('/my-helmet', isAuthenticated, getMyHelmetwalaAds);

router.put('/edit/:id', isAuthenticated, isHelmetwala, upload.single('image'), editHelmetwalaAd);

router.delete('/delete/:id', isAuthenticated, isHelmetwala, deleteHelmetwalaAd);

router.put('/change-status/:id', isAuthenticated,isAdmin ,changeHelmetwalaAdStatus );

export default router;