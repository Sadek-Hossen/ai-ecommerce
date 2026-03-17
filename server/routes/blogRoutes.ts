import express from 'express';
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Admin only routes
router.post('/', authenticate, isAdmin, createBlog);
router.put('/:id', authenticate, isAdmin, updateBlog);
router.delete('/:id', authenticate, isAdmin, deleteBlog);

export default router;
