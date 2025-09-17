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
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {

      if (user) {
        setIsAuth(true);
        setIsAuthLoading(false);
        setIsAuthenticating(false);
        return;
      }

      if (!isAuthenticating) {
        setIsAuthenticating(true);
        const anonUserUid = await signInAnonymouslyAsync();

        if (anonUserUid) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }

        setIsAuthLoading(false);
        setIsAuthenticating(false);
      }
    });

    return () => unsubscribeAuth();
  }, [isAuthenticating]);

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