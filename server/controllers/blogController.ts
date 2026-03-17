import { Request, Response } from 'express';
import { adminDb } from '../firebaseAdmin.js';

const BLOGS_COLLECTION = 'blogs';

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection(BLOGS_COLLECTION).orderBy('createdAt', 'desc').get();
    const blogs = snapshot.docs.map(doc => ({ id: doc.id, _id: doc.id, ...doc.data() }));
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const doc = await adminDb.collection(BLOGS_COLLECTION).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Blog not found' });
    res.json({ id: doc.id, _id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const blogData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const docRef = await adminDb.collection(BLOGS_COLLECTION).add(blogData);
    res.status(201).json({ id: docRef.id, _id: docRef.id, ...blogData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const blogData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    await adminDb.collection(BLOGS_COLLECTION).doc(req.params.id).update(blogData);
    res.json({ id: req.params.id, _id: req.params.id, ...blogData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    await adminDb.collection(BLOGS_COLLECTION).doc(req.params.id).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};
