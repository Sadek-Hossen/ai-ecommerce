import express from 'express';
import { getSetting, updateSetting, deleteSetting } from '../controllers/settingsController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/:key', getSetting);

// Admin only
router.post('/', authenticate, isAdmin, updateSetting);
router.delete('/:key', authenticate, isAdmin, deleteSetting);

export default router;
