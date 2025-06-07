import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../app/firebase/config';

interface AuthContextType {
  user: User | null | undefined;
}

const AuthContext = createContext<AuthContextType>({ user: undefined });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    console.log('GOODJOB AuthProvider mounted, setting up auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('FIRE or Firebase Auth state changed:', firebaseUser ? 'User found' : 'No user');
      if (firebaseUser) {
        console.log('👤 User email:', firebaseUser.email);
        console.log('🆔 User UID:', firebaseUser.uid);
      }
      setUser(firebaseUser);
    });

    return () => {
      console.log('goood AuthProvider unmounting, cleaning up listener');
      unsubscribe();
    };
  }, []);

  console.log('meh AuthProvider rendering, user state:', user ? 'logged in' : user === null ? 'logged out' : 'loading');

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);