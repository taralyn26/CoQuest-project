// app/firebase/authService.ts
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from './config';

// //// PURE WRAPPERS /////////////////////////////////////

export async function signUp(email: string, pwd: string) {
  return createUserWithEmailAndPassword(auth, email.trim(), pwd);
}

export async function login(email: string, pwd: string) {
  return signInWithEmailAndPassword(auth, email.trim(), pwd);
}

export async function logout() {
  return signOut(auth);
}

// util to watch login state globally
export function subscribe(
  cb: (user: User | null) => void,
  error?: (e: Error) => void,
) {
  return onAuthStateChanged(auth, cb, error);
}
