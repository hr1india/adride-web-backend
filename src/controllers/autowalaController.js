import Autowala from '../models/Autowala.js';
import cloudinary from '../config/cloudinary.js';

export const createAutowalaAd = async (req, res) => {
  try {
    const { registrationNumber } = req.body;

    if (!registrationNumber || !req.file) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'autowala',
      resource_type: 'image',
    });

    const autowalaAd = new Autowala({
      registrationNumber,
      imageUrl: result.secure_url,
      createdBy: req.user._id, 
    });

    await autowalaAd.save();
    res.status(201).json({ success: true, message: 'Autowala Ad created successfully', autowalaAd });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllAutowalaAds = async (req, res) => {
  try {
    const ads = await Autowala.find().populate('createdBy', 'name email');
    res.json({ success: true, ads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMyAutowalaAds = async (req, res) => {
  try {
    const ads = await Autowala.find({ createdBy: req.user._id }).populate('createdBy', 'name email');
    res.json({ success: true, ads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const editAutowalaAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { registrationNumber } = req.body;

    let autowalaAd = await Autowala.findById(id);
    if (!autowalaAd) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }

    if (autowalaAd.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    if (req.file) {
      const oldImagePublicId = autowalaAd.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`autowala/${oldImagePublicId}`);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'autowala',
        resource_type: 'image',
      });

      autowalaAd.imageUrl = result.secure_url;
    }

    autowalaAd.registrationNumber = registrationNumber || autowalaAd.registrationNumber;
    await autowalaAd.save();

    res.json({ success: true, message: 'Autowala Ad updated successfully', autowalaAd });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAutowalaAd = async (req, res) => {
  try {
    const { id } = req.params;
    const autowalaAd = await Autowala.findById(id);

    if (!autowalaAd) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }

    if (autowalaAd.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const publicId = autowalaAd.imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`autowala/${publicId}`);

    await Autowala.deleteOne({ _id: id });

    res.json({ success: true, message: 'Autowala Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const changeAutowalaAdStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const autowalaAd = await Autowala.findByIdAndUpdate(id, { status }, { new: true });

    if (!autowalaAd) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }

    res.status(200).json({ success: true, message: 'Status updated successfully', autowalaAd });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};