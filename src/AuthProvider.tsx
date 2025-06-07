import { User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribe } from '../app/firebase/authService';

const AuthContext = createContext<{ user: User | null }>({ user: null });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = subscribe(setUser, console.error);
    return unsub; //cleanup on unmount
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
