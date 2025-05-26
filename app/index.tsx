// app/index.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../src/AuthProvider'; // ← NEW
import Login from './login';
import SignUp from './signup';

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();                 // ← NEW
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // If a user session exists, send them straight into the tab navigator
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)/map');          // replace = no back-nav to auth screens
    }
  }, [user]);

  // Optional: splash / loading while Firebase determines persistence status
  if (user === undefined) return null; // could render ActivityIndicator here

  return mode === 'login' ? (
    <Login
      onLogin={() => {}}          // handler now unused but keeps prop contract
      onGoToSignUp={() => setMode('signup')}
    />
  ) : (
    <SignUp
      onSignUp={() => {}}         // idem
      onGoToLogin={() => setMode('login')}
    />
  );
}
