// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // hide the native header so our screens can go full‑screen
    <Stack screenOptions={{ headerShown: false }} />
  );
}
