import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure storage to save in the frontend public/uploads directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Navigate out of backend and into frontend/public
    cb(null, path.join(__dirname, '../../../frontend/public'));
  },
  filename: function (req, file, cb) {
    // Generate unique name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'uploads/img-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  // Return the path relative to public so it can be used directly as src
  res.json({ imageUrl: '/' + req.file.filename.replace(/\\/g, '/') });
});

export default router;
