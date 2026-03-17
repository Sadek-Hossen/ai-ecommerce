import { Request, Response } from 'express';
import { adminDb } from '../firebaseAdmin.js';

const SETTINGS_COLLECTION = 'settings';

export const getSetting = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection(SETTINGS_COLLECTION).where('key', '==', req.params.key).limit(1).get();
    if (snapshot.empty) return res.json(null);
    const doc = snapshot.docs[0];
    res.json({ _id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    const snapshot = await adminDb.collection(SETTINGS_COLLECTION).where('key', '==', key).limit(1).get();
    
    const settingData = {
      key,
      value,
      updatedAt: new Date().toISOString()
    };

    if (snapshot.empty) {
      const docRef = await adminDb.collection(SETTINGS_COLLECTION).add(settingData);
      res.json({ _id: docRef.id, ...settingData });
    } else {
      const docId = snapshot.docs[0].id;
      await adminDb.collection(SETTINGS_COLLECTION).doc(docId).update(settingData);
      res.json({ _id: docId, ...settingData });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

export const deleteSetting = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection(SETTINGS_COLLECTION).where('key', '==', req.params.key).limit(1).get();
    if (!snapshot.empty) {
      await adminDb.collection(SETTINGS_COLLECTION).doc(snapshot.docs[0].id).delete();
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete setting' });
  }
};
