import { Request, Response } from 'express';
import { adminDb } from '../firebaseAdmin.js';

const USERS_COLLECTION = 'users';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const doc = await adminDb.collection(USERS_COLLECTION).doc((req as any).user.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    const userData = doc.data();
    if (userData) delete userData.password;
    res.json({ id: doc.id, _id: doc.id, ...userData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const userId = (req as any).user.id;
    await adminDb.collection(USERS_COLLECTION).doc(userId).update({ name, email });
    const doc = await adminDb.collection(USERS_COLLECTION).doc(userId).get();
    const userData = doc.data();
    if (userData) delete userData.password;
    res.json({ id: doc.id, _id: doc.id, ...userData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userDoc = await adminDb.collection(USERS_COLLECTION).doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });
    
    const userData = userDoc.data();
    const addresses = userData?.addresses || [];
    const newAddress = { id: Math.random().toString(36).substr(2, 9), ...req.body };
    addresses.push(newAddress);
    
    await adminDb.collection(USERS_COLLECTION).doc(userId).update({ addresses });
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add address' });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userDoc = await adminDb.collection(USERS_COLLECTION).doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });
    
    const userData = userDoc.data();
    const addresses = (userData?.addresses || []).filter((a: any) => a.id !== req.params.addressId);
    
    await adminDb.collection(USERS_COLLECTION).doc(userId).update({ addresses });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  try {
    const { cart } = req.body;
    const userId = (req as any).user.id;
    await adminDb.collection(USERS_COLLECTION).doc(userId).update({ cart });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
};
