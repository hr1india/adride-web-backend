import WallAd from '../models/wallAd.js';
import Helmetwala from '../models/Helmetwala.js';
import autowala from '../models/Autowala.js';

import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const createWallAd = async (req, res) => {
  try {
    const { wallName, location, height, breadth, monthlyPrice, availableFrom, availableTo } = req.body;

    if (!wallName || !location || !height || !breadth || !monthlyPrice || !availableFrom || !availableTo) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Image is required' });
    }

    console.log('Uploading image to Cloudinary...');
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'wallads',
      resource_type: 'image',
    });

    fs.unlinkSync(req.file.path);

    console.log('Cloudinary Upload Success:', result.secure_url);

    const wallAd = new WallAd({
      wallName,
      location,
      imageUrl: result.secure_url,
      height,
      breadth,
      monthlyPrice,
      availableFrom,
      availableTo,
      createdBy: req.user._id,
    });

    await wallAd.save();
    res.status(201).json({ success: true, message: 'Wall Ad created successfully', wallAd });
  } catch (error) {
    console.error('Error in createWallAd:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllWallAds = async (req, res) => {
  try {
    const wallAds = await WallAd.find().populate('createdBy', 'name email');
    res.json({ success: true, wallAds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getMyWallAds = async (req, res) => {
  try {
    const wallAds = await WallAd.find({ createdBy: req.user._id });
    res.json({ success: true, wallAds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllApprovedWallAds = async (req, res) => {
  try {
    const wallAds = await WallAd.find({ isApproved: 'approved' });
    res.json({ success: true, wallAds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllRejectedWallAds = async (req, res) => {
  try {
    const wallAds = await WallAd.find({ isApproved: 'rejected' });
    res.json({ success: true, wallAds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllPendingWallAds = async (req, res) => {
  try {
    const wallAds = await WallAd.find({ isApproved: 'pending' });
    res.json({ success: true, wallAds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const editWallAd = async (req, res) => {
  try {
    const { wallName, location, height, breadth, monthlyPrice, availableFrom, availableTo } = req.body;
    const wallAd = await WallAd.findById(req.params.id);

    if (!wallAd) {
      return res.status(404).json({ success: false, error: 'Wall Ad not found' });
    }

    if (String(wallAd.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, error: 'Unauthorized to edit this Wall Ad' });
    }

    if (req.file) {
      console.log('Uploading new image to Cloudinary...');
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'wallads',
        resource_type: 'image',
      });

      fs.unlinkSync(req.file.path);

      if (wallAd.imageUrl) {
        const oldImageUrlParts = wallAd.imageUrl.split('/');
        const oldImagePublicId = `wallads/${oldImageUrlParts[oldImageUrlParts.length - 1].split('.')[0]}`;

        console.log('Deleting old image from Cloudinary:', oldImagePublicId);
        await cloudinary.uploader.destroy(oldImagePublicId);
      }

      wallAd.imageUrl = result.secure_url;
    }

    wallAd.wallName = wallName ?? wallAd.wallName;
    wallAd.location = location ?? wallAd.location;
    wallAd.height = height ?? wallAd.height;
    wallAd.breadth = breadth ?? wallAd.breadth;
    wallAd.monthlyPrice = monthlyPrice ?? wallAd.monthlyPrice;
    wallAd.availableFrom = availableFrom ?? wallAd.availableFrom;
    wallAd.availableTo = availableTo ?? wallAd.availableTo;

    await wallAd.save();
    res.json({ success: true, message: 'Wall Ad updated successfully', wallAd });
  } catch (error) {
    console.error('Error in editWallAd:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export const deleteWallAd = async (req, res) => {
  try {
    const wallAd = await WallAd.findById(req.params.id);

    if (!wallAd) {
      return res.status(404).json({ success: false, error: 'Wall Ad not found' });
    }

    if (String(wallAd.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, error: 'Unauthorized to delete this Wall Ad' });
    }

    if (wallAd.imageUrl) {
      const oldImageId = wallAd.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`wallads/${oldImageId}`);
    }

    await wallAd.deleteOne();
    res.json({ success: true, message: 'Wall Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const changeWallAdStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expecting status in the request body
        console.log(req.body)

        // Validate status
        if (!["approved", "rejected", "pending"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const wallAd = await WallAd.findById(id);
        if (!wallAd) {
            return res.status(404).json({ message: "Wall Ad not found" });
        }

        wallAd.isApproved = status; // Update status
        await wallAd.save();

        res.status(200).json({ message: `Ad status changed to ${status}`, wallAd });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getAllWallById = async (req, res) => {
  try {
    const wallAd = await WallAd.findById(req.params.id);
    res.json({ success: true, wallAd });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};