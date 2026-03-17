import express from 'express';
import { getProfile, updateProfile, addAddress, deleteAddress, updateCart } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate); // All user routes require authentication

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/addresses', addAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.put('/cart', updateCart);

export default router;
