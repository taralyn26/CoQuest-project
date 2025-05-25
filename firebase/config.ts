// app/firebase/config.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDBgMcaiT-7FSBCY11HsVzhsigasATAtoE",
  authDomain: "coquest-99dac.firebaseapp.com",
  projectId: "coquest-99dac",
  storageBucket: "coquest-99dac.appspot.com",
  messagingSenderId: "42867243923",
  appId: "1:42867243923:web:03525d6b87d16714ac8666",
};

// Initialize Firebase app only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize auth with proper error handling
let auth;
try {
  // Try to initialize auth with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error: any) {
  // If already initialized (hot reload), get existing instance
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    console.error('Firebase auth initialization error:', error);
    // Fallback to default auth
    auth = getAuth(app);
  }
}

export { app, auth };
