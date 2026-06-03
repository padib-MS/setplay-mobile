import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const fullScreenModal = {
  presentation: "fullScreenModal",
  animation: "none",
} as const;

const transparentModal = {
  presentation: "transparentModal",
  animation: "none",
} as const;

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <SafeAreaProvider>
        <ThemeProvider value={DarkTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "none",
            }}
          >
            <Stack.Screen name="(tabs)" />

            <Stack.Screen name="(screens)/gig-card" options={fullScreenModal} />
            <Stack.Screen
              name="(screens)/make-offer"
              options={fullScreenModal}
            />
            <Stack.Screen name="(screens)/search" options={fullScreenModal} />
            <Stack.Screen
              name="(screens)/share-gig"
              options={fullScreenModal}
            />
            <Stack.Screen name="(screens)/save-gig" options={fullScreenModal} />
            <Stack.Screen
              name="(screens)/track-upload"
              options={fullScreenModal}
            />

            <Stack.Screen name="(screens)/chat" options={transparentModal} />
            <Stack.Screen
              name="(screens)/account-settings"
              options={transparentModal}
            />
            <Stack.Screen
              name="(screens)/live-video"
              options={transparentModal}
            />
            <Stack.Screen
              name="(screens)/burger-menu"
              options={transparentModal}
            />
            <Stack.Screen
              name="(screens)/rate-role"
              options={transparentModal}
            />
            <Stack.Screen
              name="(screens)/datetime-picker"
              options={transparentModal}
            />
            <Stack.Screen
              name="(screens)/choose-song"
              options={transparentModal}
            />
            <Stack.Screen
              name="(screens)/step-one"
              options={transparentModal}
            />
            <Stack.Screen
              name="(screens)/step-two"
              options={transparentModal}
            />
            <Stack.Screen
              name="(screens)/user-profile"
              options={transparentModal}
            />

            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
