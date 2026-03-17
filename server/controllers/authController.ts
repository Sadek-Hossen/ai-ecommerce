import { Request, Response } from 'express';
import { adminDb } from '../firebaseAdmin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const USERS_COLLECTION = 'users';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    const snapshot = await adminDb.collection(USERS_COLLECTION).where('email', '==', email).limit(1).get();
    if (!snapshot.empty) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'client',
      createdAt: new Date().toISOString()
    };

    const docRef = await adminDb.collection(USERS_COLLECTION).add(userData);
    const token = jwt.sign({ id: docRef.id, role: userData.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: { id: docRef.id, name: userData.name, email: userData.email, role: userData.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const snapshot = await adminDb.collection(USERS_COLLECTION).where('email', '==', email).limit(1).get();
    if (snapshot.empty) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: userDoc.id, role: userData.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: userDoc.id, name: userData.name, email: userData.email, role: userData.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};
