import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-get-random-values';


import { useAuth } from '../src/AuthProvider';
import Login from './login';
import SignUp from './signup';

export default function Index() {
  console.log(' Index component rendering');
  
  const { user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    console.log(' Auth state changed in index:', user);
    if (user) {
      console.log(' Redirecting to /map');
      router.replace('/(tabs)/map');
    }
  }, [user]);

  // Still loading auth state
  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // User is logged in, let router handle navigation
  if (user) {
    return null;
  }

  // User is not logged in, show auth screens
  return mode === 'login' ? (
    <Login onGoToSignUp={() => setMode('signup')} />
  ) : (
    <SignUp onGoToLogin={() => setMode('login')} />
  );
}