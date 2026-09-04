import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDldKm1ZuMjcAWsxNZAFCgk4WgqSY__TIQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "holistic-edge.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "holistic-edge",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "holistic-edge.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1070383859255",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1070383859255:web:5372dc3dce6e34e46661b2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NGZ8VV453R"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export default app;
