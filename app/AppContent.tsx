import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../src/AuthProvider';
import Login from './login';
import SignUp from './signup';

export default function AppContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    console.log('oeii, Auth state changed:', user);
    if (user) {
      console.log('Noice, Redirecting to /map');
      router.replace('/(tabs)/map');
    }
  }, [user]);

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user) {
    // User is logged in, let the router handle navigation
    return null;
  }

  return mode === 'login' ? (
    <Login onGoToSignUp={() => setMode('signup')} />
  ) : (
    <SignUp onGoToLogin={() => setMode('login')} />
  );
}