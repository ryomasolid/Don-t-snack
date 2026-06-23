import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { useEffect } from "react";
import { Platform } from "react-native";
import { MobileAds } from "react-native-google-mobile-ads";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

function AppLayout() {
  useEffect(() => {
    const initAds = async () => {
      if (Platform.OS === "ios") {
        await requestTrackingPermissionsAsync();
      }
      await MobileAds().initialize();
    };
    initAds();
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
