import express from 'express';
import multer from 'multer';

const router = express.Router();

// Use memory storage instead of disk storage for cloud compatibility
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Accept both 'file' and 'image' field names
router.post('/', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req: any, res: any) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const file = files?.['file']?.[0] || files?.['image']?.[0];
  
  if (!file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  
  // Convert image to Base64 so it can be saved directly to the database
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  
  // Return both url and imageUrl for compatibility
  res.json({ url: base64Image, imageUrl: base64Image });
});

export default router;
