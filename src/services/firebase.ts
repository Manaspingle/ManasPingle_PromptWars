import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAXuysMRuyZlvQBpevlYKkqB76CUOaeIhw",
  authDomain: "thinklens-2dfde.firebaseapp.com",
  projectId: "thinklens-2dfde",
  storageBucket: "thinklens-2dfde.firebasestorage.app",
  messagingSenderId: "715578045329",
  appId: "1:715578045329:web:7b44ba8fc1704c5c912030",
  measurementId: "G-VEDDB1LHSE"
};

// Initialize Firebase without duplicating apps
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
