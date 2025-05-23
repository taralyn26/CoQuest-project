import { FirebaseError } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User,
    UserCredential
} from 'firebase/auth';
import { auth } from './config';

export interface AuthError {
  code: string;
  message: string;
}

export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    const firebaseError = error as FirebaseError;
    throw {
      code: firebaseError.code,
      message: firebaseError.message
    } as AuthError;
  }
};

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    const firebaseError = error as FirebaseError;
    throw {
      code: firebaseError.code,
      message: firebaseError.message
    } as AuthError;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    const firebaseError = error as FirebaseError;
    throw {
      code: firebaseError.code,
      message: firebaseError.message
    } as AuthError;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
}; 