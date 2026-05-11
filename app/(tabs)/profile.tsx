import { useAuth, useClerk, useUser } from "@clerk/expo";
import * as Notifications from "expo-notifications";
import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getClerkPublishableKey } from "@/src/constants/env";
import { getPreferences, savePreferences, type ThemePreference } from "@/src/database/queries/preferences";
import { useThemeStore } from "@/src/store/preferences-store";

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

function MissingClerk() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <View className="flex-1 justify-center px-6">
        <Text className="text-center text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env (and mirror it in app.config via dotenv), then restart the
          dev server to enable sign-in.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function ThemeOption({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center rounded-2xl py-3 ${
        active ? "bg-blue-600" : "bg-slate-100 dark:bg-slate-800"
      }`}
    >
      <Text
        className={`text-sm font-semibold ${active ? "text-white" : "text-slate-700 dark:text-slate-200"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ProfileWithClerk() {
  const router = useRouter();
  const scheme = useColorScheme();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();

  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    void getPreferences().then((p) => {
      setNotificationsEnabled(p.notificationsEnabled);
    });
  }, []);

  const applyTheme = async (next: ThemePreference) => {
    setPreference(next);
    await savePreferences({
      theme: next,
      language: "en",
      notificationsEnabled,
    });
  };

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await savePreferences({
      theme: preference,
      language: "en",
      notificationsEnabled: value,
    });
    if (value) {
      const existing = await Notifications.getPermissionsAsync();
      if (!existing.granted) {
        const req = await Notifications.requestPermissionsAsync();
        if (!req.granted) {
          Alert.alert(
            "Notifications disabled",
            "Enable alerts in system settings to receive breaking news updates.",
          );
        }
      }
    }
  };

  const signOut = async () => {
    await clerk.signOut();
  };

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  const primary = user?.primaryEmailAddress?.emailAddress;
  const name =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    primary ||
    "Signed in";

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="border-b border-slate-200 px-4 pb-4 pt-2 dark:border-slate-800">
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">Profile</Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400">Account, appearance, and alerts</Text>
        </View>

        <View className="mt-6 px-4">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Account
          </Text>

          {isSignedIn ? (
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <View className="flex-row items-center gap-4">
                {user?.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    style={{ width: 64, height: 64, borderRadius: 32 }}
                    accessibilityLabel="Profile photo"
                  />
                ) : (
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                    <Text className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {(name[0] ?? "?").toUpperCase()}
                    </Text>
                  </View>
                )}
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-slate-900 dark:text-white" numberOfLines={2}>
                    {name}
                  </Text>
                  {primary ? (
                    <Text className="mt-1 text-sm text-slate-600 dark:text-slate-300" numberOfLines={2}>
                      {primary}
                    </Text>
                  ) : null}
                  <Text className="mt-1 text-xs text-slate-400">User id · {user?.id ?? "—"}</Text>
                </View>
              </View>
              <Pressable
                onPress={() => void signOut()}
                className="mt-4 items-center rounded-2xl border border-slate-200 py-3 dark:border-slate-700"
              >
                <Text className="font-semibold text-slate-900 dark:text-white">Sign out</Text>
              </Pressable>
            </View>
          ) : (
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <Text className="text-base text-slate-600 dark:text-slate-300">
                Sign in to sync your Clerk profile across devices.
              </Text>
              <Pressable
                onPress={() => router.push("/sign-in" as Href)}
                className="mt-4 items-center rounded-2xl bg-blue-600 py-3"
              >
                <Text className="font-semibold text-white">Sign in</Text>
              </Pressable>
              <Pressable onPress={() => router.push("/sign-up" as Href)} className="mt-3 items-center py-2">
                <Text className="font-semibold text-blue-600">Create an account</Text>
              </Pressable>
            </View>
          )}

          <Text className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Appearance
          </Text>
          <View className="mb-2 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <Text className="text-base font-semibold text-slate-900 dark:text-white">Theme</Text>
            <Text className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Match system: {scheme ?? "unknown"} · saved: {preference}
            </Text>
            <View className="mt-4 flex-row gap-2">
              <ThemeOption label="System" active={preference === "system"} onPress={() => void applyTheme("system")} />
              <ThemeOption label="Light" active={preference === "light"} onPress={() => void applyTheme("light")} />
              <ThemeOption label="Dark" active={preference === "dark"} onPress={() => void applyTheme("dark")} />
            </View>
          </View>

          <Text className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Notifications
          </Text>
          <View className="flex-row items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <View className="flex-1 pr-4">
              <Text className="text-base font-semibold text-slate-900 dark:text-white">Push alerts</Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                Breaking headlines and daily digest (toggle to request permission)
              </Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={(v) => void toggleNotifications(v)} />
          </View>

          <Text className="mt-8 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Reading lists and article cache stay on this device. Clerk handles authentication only.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ProfileScreen() {
  if (!getClerkPublishableKey()) {
    return <MissingClerk />;
  }
  return <ProfileWithClerk />;
}
