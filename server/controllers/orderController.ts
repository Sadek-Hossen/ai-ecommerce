import { Request, Response } from 'express';
import { adminDb } from '../firebaseAdmin.js';

const ORDERS_COLLECTION = 'orders';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const docRef = await adminDb.collection(ORDERS_COLLECTION).add(orderData);
    res.status(201).json({ id: docRef.id, _id: docRef.id, ...orderData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection(ORDERS_COLLECTION)
      .where('userId', '==', req.params.userId)
      .orderBy('createdAt', 'desc')
      .get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, _id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection(ORDERS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, _id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all orders' });
  }
};
