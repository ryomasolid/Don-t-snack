import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { MobileAds } from "react-native-google-mobile-ads";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

function AppLayout() {
  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => console.log("AdMob 初期化"));
  }, []);

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
