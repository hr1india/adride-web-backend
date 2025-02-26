import express from 'express';
import { isAuthenticated, isAutowala } from '../middlewares/automiddleware.js';
import { createAutowalaAd, getAllAutowalaAds,getMyAutowalaAds, editAutowalaAd, deleteAutowalaAd, changeAutowalaAdStatus} from '../controllers/autowalaController.js';
import upload from '../middlewares/upload.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/create', isAuthenticated, isAutowala, upload.single('image'), createAutowalaAd);
router.get('/', getAllAutowalaAds);
router.get('/my-auto', isAuthenticated, getMyAutowalaAds);
router.put('/edit/:id', isAuthenticated, isAutowala, upload.single('image'), editAutowalaAd);
router.delete('/delete/:id', isAuthenticated, isAutowala, deleteAutowalaAd);
router.put('/change-status/:id',isAuthenticated,isAdmin,changeAutowalaAdStatus);


export default router;
