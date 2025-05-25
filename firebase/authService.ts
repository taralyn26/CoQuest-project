// app/services/authService.ts
// app/firebase/authService.ts
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    UserCredential
} from 'firebase/auth';
import { auth } from './config';
  
  export function signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  
  export function login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  