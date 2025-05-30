// index.tsx
import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';


import { AuthProvider, useAuth } from '../src/AuthProvider';
import Login from './login';
import SignUp from './signup';

export default function Index() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    console.log('👤 Auth state changed:', user);
    if (user) {
      console.log('✅ Redirecting to /map');
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

  return mode === 'login' ? (
    <Login onGoToSignUp={() => setMode('signup')} />
  ) : (
    <SignUp onGoToLogin={() => setMode('login')} />
  );
}
