import Ad from '../models/ad.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const createAd = async (req, res) => {
  try {
    const { campaignName, description, location } = req.body;

    if (!campaignName || !description || !location) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Image is required' });
    }

    console.log('Uploading image to Cloudinary...');

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ads',
      resource_type: 'image',
    });

    console.log('Cloudinary Upload Success:', result.secure_url);
    fs.unlinkSync(req.file.path);
    console.log('file removed from /uploads folder');

    const ad = new Ad({
      campaignName,
      description,
      imageUrl: result.secure_url,
      location,
      createdBy: req.user._id,
    });

    await ad.save();
    res.status(201).json({ success: true, message: 'Ad created successfully', ad });
  } catch (error) {
    console.error('Error in createAd:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAds = async (req, res) => {
  try {
    const ads = await Ad.find().populate('createdBy', 'name email');
    res.json({ success: true, ads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMyAds = async (req, res) => {
  try {
    const ads = await Ad.find({ createdBy: req.user._id });
    res.json({ success: true, ads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const editAd = async (req, res) => {
  try {
    const { campaignName, description, location } = req.body;
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }

    if (String(ad.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, error: 'Unauthorized to edit this ad' });
    }

    if (req.file) {
      console.log('Uploading new image to Cloudinary...');
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ads',
        resource_type: 'image',
      });

      fs.unlinkSync(req.file.path);

      if (ad.imageUrl) {
        const oldImageId = ad.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`ads/${oldImageId}`);
      }

      ad.imageUrl = result.secure_url;
    }

    ad.campaignName = campaignName || ad.campaignName;
    ad.description = description || ad.description;
    ad.location = location || ad.location;

    await ad.save();
    res.json({ success: true, message: 'Ad updated successfully', ad });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }

    if (String(ad.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, error: 'Unauthorized to delete this ad' });
    }

    if (ad.imageUrl) {
      const oldImageId = ad.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`ads/${oldImageId}`);
    }

    await ad.deleteOne();
    res.json({ success: true, message: 'Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const approveAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }

    ad.status = 'approved';
    await ad.save();
    res.json({ success: true, message: 'Ad approved successfully', ad });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const rejectAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }

    ad.status = 'rejected';
    await ad.save();
    res.json({ success: true, message: 'Ad rejected successfully', ad });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};