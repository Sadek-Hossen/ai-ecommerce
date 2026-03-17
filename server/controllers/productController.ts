import { Request, Response } from 'express';
import { adminDb } from '../firebaseAdmin.js';

const PRODUCTS_COLLECTION = 'products';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection(PRODUCTS_COLLECTION).get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, _id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const doc = await adminDb.collection(PRODUCTS_COLLECTION).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Product not found' });
    res.json({ id: doc.id, _id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const docRef = await adminDb.collection(PRODUCTS_COLLECTION).add(productData);
    res.status(201).json({ id: docRef.id, _id: docRef.id, ...productData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    await adminDb.collection(PRODUCTS_COLLECTION).doc(req.params.id).update(productData);
    res.json({ id: req.params.id, _id: req.params.id, ...productData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await adminDb.collection(PRODUCTS_COLLECTION).doc(req.params.id).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
