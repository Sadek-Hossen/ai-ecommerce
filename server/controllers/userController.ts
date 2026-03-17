import { Request, Response } from 'express';
import { User } from '../models/User.js';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      (req as any).user.id,
      { name, email },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Address Management
export const addAddress = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const newAddress = { id: Math.random().toString(36).substr(2, 9), ...req.body };
    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add address' });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    (user.addresses as any) = user.addresses.filter((a: any) => a.id !== req.params.addressId);
    await user.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

// Cart Management
export const updateCart = async (req: Request, res: Response) => {
  try {
    const { cart } = req.body;
    const user = await User.findByIdAndUpdate(
      (req as any).user.id,
      { cart },
      { new: true }
    ).select('cart');
    res.json(user?.cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
};
