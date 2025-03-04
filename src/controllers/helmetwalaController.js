import Helmetwala from '../models/Helmetwala.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const createHelmetwalaAd = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Image is required' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'helmetwala',
      resource_type: 'image',
    });

    fs.unlinkSync(req.file.path);

    const helmetwalaAd = new Helmetwala({
      imageUrl: result.secure_url,
      createdBy: req.user._id,
    });

    await helmetwalaAd.save();
    res.status(201).json({ success: true, message: 'Helmetwala Ad created successfully', helmetwalaAd });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllHelmetwalaAds = async (req, res) => {
  try {
    const ads = await Helmetwala.find().populate('createdBy', 'name email');
    res.json({ success: true, ads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMyHelmetwalaAds = async (req, res) => {
  try {
    const ads = await Helmetwala.find({ createdBy: req.user._id }).populate('createdBy', 'name email');
    res.json({ success: true, ads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const editHelmetwalaAd = async (req, res) => {
  try {
    const { id } = req.params;

    let helmetwalaAd = await Helmetwala.findById(id);
    if (!helmetwalaAd) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }

    if (helmetwalaAd.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    if (req.file) {
      const oldImagePublicId = helmetwalaAd.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`helmetwala/${oldImagePublicId}`);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'helmetwala',
        resource_type: 'image',
      });

      fs.unlinkSync(req.file.path);

      helmetwalaAd.imageUrl = result.secure_url;
    }

    await helmetwalaAd.save();
    res.json({ success: true, message: 'Helmetwala Ad updated successfully', helmetwalaAd });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteHelmetwalaAd = async (req, res) => {
  try {
    const { id } = req.params;
    const helmetwalaAd = await Helmetwala.findById(id);

    if (!helmetwalaAd) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }

    if (helmetwalaAd.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const publicId = helmetwalaAd.imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`helmetwala/${publicId}`);

    await Helmetwala.deleteOne({ _id: id });

    res.json({ success: true, message: 'Helmetwala Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// export const getMyHelmetwalaAds = async (req, res) => {
//   try {
//     const ads = await Helmetwala.find({ createdBy: req.user._id }).populate('createdBy', 'name email');

//     if (ads.length === 0) {
//       return res.status(404).json({ success: false, error: 'No ads found for this user' });
//     }

//     res.json({ success: true, ads });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

export const getAllApprovedHelmetwalaAds = async (req, res) => {
  try {
    const ads = await Helmetwala.find({ status: 'approved' }).populate('createdBy', 'name email');
    res.json({ success: true, ads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export const getAllRejectedHelmetwalaAds = async (req, res) => {
  try {
    const ads = await Helmetwala.find({ status: 'rejected' }).populate('createdBy', 'name email');
    res.json({ success: true, ads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export const getAllPendingHelmetwalaAds = async (req, res) => {
  try {
    const ads = await Helmetwala.find({ status: 'pending' }).populate('createdBy', 'name email');
    res.json({ success: true, ads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}


  export const changeHelmetwalaAdStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const helmetwalaAd = await Helmetwala.findByIdAndUpdate(id, { status }, { new: true });

      if (!helmetwalaAd) {
        return res.status(404).json({ success: false, error: 'Ad not found' });
      }

      res.status(200).json({ success: true, message: 'Status updated successfully', helmetwalaAd });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };