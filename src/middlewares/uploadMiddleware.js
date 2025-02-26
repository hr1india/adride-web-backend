import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: `adride/users/${req.user?._id || 'temp'}`,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: { width: 500, height: 500, crop: 'limit' },
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    resource_type: 'auto'
  })
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  }
});

// Error handling middleware for Multer
export const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: `File upload error: ${err.message}`
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  next();
};

export { upload };
