import express from 'express';
import multer from 'multer';

const router = express.Router();

// Use memory storage instead of disk storage for cloud compatibility
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit to prevent huge base64 strings
});

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  
  // Convert image to Base64 so it can be saved directly to the database
  const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  
  res.json({ imageUrl: base64Image });
});

export default router;
