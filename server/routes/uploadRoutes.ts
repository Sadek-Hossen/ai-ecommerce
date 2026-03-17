import express from 'express';
import { upload } from '../middleware/upload.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, isAdmin, upload.single('file'), (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Return the path to the file
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ url: filePath });
});

export default router;
