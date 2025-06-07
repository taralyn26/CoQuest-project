import { Stack } from 'expo-router';
import React from 'react';

import { AuthProvider } from '../src/AuthProvider';

export default function RootLayout() {
  console.log('🏗️ Root layout rendering with AuthProvider');
  
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="manage-groups" />
        <Stack.Screen name="create_group" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
    </AuthProvider>
  );
}