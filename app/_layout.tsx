import { auth } from '@/firebaseConfig';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { signInAnonymouslyAsync } from '../store/firestore';

function AppLayout() {
  const [isAuth, setIsAuth] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setIsAuthLoading(false);

      if (user) {
        setIsAuth(true);
      } else {
        const anonUser = await signInAnonymouslyAsync();
        if (anonUser) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (isAuthLoading) {
    return null;
  }

  if (!isAuth) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <AppLayout />
      <StatusBar style="auto" />
    </PaperProvider>
  );
}