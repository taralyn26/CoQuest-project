//from firebase directly
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
//SUPER secret dont tell anybody!!!
const firebaseConfig = {
  apiKey: "AIzaSyDBgMcaiT-7FSBCY11HsVzhsigasATAtoE",
  authDomain: "coquest-99dac.firebaseapp.com",
  projectId: "coquest-99dac",
  storageBucket: "coquest-99dac.firebasestorage.app",
  messagingSenderId: "42867243923",
  appId: "1:42867243923:web:03525d6b87d16714ac8666"
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

//the Auth export
export const auth: Auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});




