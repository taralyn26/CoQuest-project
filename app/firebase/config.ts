// app/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDBgMcaiT-7FSBCY11HsVzhsigasATAtoE",
    authDomain: "coquest-99dac.firebaseapp.com",
    projectId: "coquest-99dac",
    storageBucket: "coquest-99dac.firebasestorage.app",
    messagingSenderId: "42867243923",
    appId: "1:42867243923:web:03525d6b87d16714ac8666"
  };

const app      = initializeApp(firebaseConfig)
export const auth      = getAuth(app)
export const db        = getFirestore(app)
