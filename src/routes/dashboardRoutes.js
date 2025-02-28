import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Ad from '../models/ad.js';
import Autowala from '../models/Autowala.js';
import WallAd from '../models/wallAd.js';
import Helmetwala from '../models/Helmetwala.js';
// import Payment from '../models/paymentModel.js';

const router = express.Router();

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Admin
router.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const activeUsers = await User.countDocuments();
    //   const totalEarnings = await Payment.aggregate([
    //     { $group: { _id: null, total: { $sum: '$amount' } } },
    //   ]);
      const pendingApprovals = await User.countDocuments({status : 'pending'});
      const totalApprovals = await User.countDocuments({status : 'active'});
    //   const totalAdsApproved = await Ad.countDocuments();
      const AutowalaAds = await Autowala.countDocuments();
      const WallAds = await WallAd.countDocuments();
      const HelmetAds = await Helmetwala.countDocuments();
      const platformEngagement = 1500; // If you have engagement tracking, replace with real data

      res.json({
        activeUsers,
        // totalEarnings: totalEarnings[0]?.total || 0,
        pendingApprovals,
        // totalAdsApproved,
        platformEngagement,
        AutowalaAds,
        WallAds,
        HelmetAds,
        totalApprovals,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
  })
);

export default router;
