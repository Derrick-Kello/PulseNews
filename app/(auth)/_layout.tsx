import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { getClerkPublishableKey } from "@/src/constants/env";

export default function AuthLayout() {
  const scheme = useColorScheme();
  const clerkPk = getClerkPublishableKey();
  const { isSignedIn, isLoaded } = useAuth();

  if (!clerkPk) {
    return <Redirect href="/(tabs)" />;
  }

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  const headerBg = scheme === "dark" ? "#020617" : "#f8fafc";
  const headerTint = scheme === "dark" ? "#93c5fd" : "#2563eb";

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
        headerTintColor: headerTint,
        headerStyle: { backgroundColor: headerBg },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: headerBg },
      }}
    >
      <Stack.Screen name="sign-in" options={{ title: "Sign in" }} />
      <Stack.Screen name="sign-up" options={{ title: "Sign up" }} />
    </Stack>
  );
}
