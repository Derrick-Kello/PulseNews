import "../global.css";

import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { getClerkPublishableKey } from "@/src/constants/env";
import { getAllBookmarkIds } from "@/src/database/queries/bookmarks";
import { queryClient } from "@/src/providers/query-client";
import { ThemeBootstrap } from "@/src/providers/theme-bootstrap";
import { useBookmarkStore } from "@/src/store/bookmark-store";

export default function RootLayout() {
  useEffect(() => {
    getAllBookmarkIds().then((ids) => useBookmarkStore.getState().seed(ids));
  }, []);

  const publishableKey = getClerkPublishableKey();

  const tree = (
    <QueryClientProvider client={queryClient}>
      <ThemeBootstrap />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="article/[id]" />
      </Stack>
    </QueryClientProvider>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {publishableKey ? (
          <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            {tree}
          </ClerkProvider>
        ) : (
          tree
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
