import express from 'express';
import { createOrder, getUserOrders, getAllOrders } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/user/:userId', getUserOrders);
router.get('/admin/all', getAllOrders);

export default router;
