import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="details/[id]" 
          options={{ 
            headerShown: true,
            title: 'Details',
            presentation: 'modal'
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}