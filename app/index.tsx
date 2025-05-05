// app/index.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import Login from './login';
import SignUp from './signup';

export default function Index() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const onSuccess = () => {
    // after either flow, send them into your tab navigator
    router.push('/(tabs)/map');
  };

  return mode === 'login' ? (
    <Login
      onLogin={onSuccess}
      onGoToSignUp={() => setMode('signup')}
    />
  ) : (
    <SignUp
      onSignUp={onSuccess}
      onGoToLogin={() => setMode('login')}
    />
  );
}
