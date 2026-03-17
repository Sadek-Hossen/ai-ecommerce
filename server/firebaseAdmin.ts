import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json' assert { type: 'json' };

const app = !admin.apps.length 
  ? admin.initializeApp({
      projectId: firebaseConfig.projectId,
    })
  : admin.app();

export const adminDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const adminAuth = admin.auth(app);
