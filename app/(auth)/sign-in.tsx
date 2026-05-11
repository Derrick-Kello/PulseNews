import { useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function navigateAfterSession({
  session,
  decorateUrl,
  router,
}: {
  session: { currentTask?: unknown } | null | undefined;
  decorateUrl: (path: string) => string;
  router: ReturnType<typeof useRouter>;
}) {
  if (session?.currentTask) return;
  const url = decorateUrl("/(tabs)");
  if (Platform.OS === "web" && url.startsWith("http")) {
    window.location.href = url;
  } else {
    router.replace(url as Href);
  }
}

export default function SignInScreen() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const busy = fetchStatus === "fetching";

  const handleSubmit = async () => {
    if (!signIn) return;

    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (error) {
      Alert.alert("Sign in failed", error.message ?? "Could not sign in.");
      return;
    }

    if (signIn.status === "complete") {
      const fin = await signIn.finalize({
        navigate: (opts) => navigateAfterSession({ ...opts, router }),
      });
      if (fin.error) {
        Alert.alert("Sign in failed", fin.error.message ?? "Could not finish sign-in.");
      }
      return;
    }

    Alert.alert(
      "Additional step required",
      `Sign-in status: ${signIn.status}. Complete MFA or other factors in Clerk if enabled.`,
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          <Text className="text-base text-slate-600 dark:text-slate-300">
            Sign in with the email and password configured for your Clerk instance.
          </Text>

          <Text className="mb-1 mt-6 text-sm font-semibold text-slate-700 dark:text-slate-200">Email</Text>
          <TextInput
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="you@example.com"
            placeholderTextColor="#94a3b8"
          />

          <Text className="mb-1 mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Password</Text>
          <TextInput
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#94a3b8"
          />

          <Pressable
            disabled={busy || !emailAddress || !password}
            onPress={() => void handleSubmit()}
            className="mt-6 items-center rounded-2xl bg-blue-600 py-4 disabled:opacity-50"
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-semibold text-white">Continue</Text>
            )}
          </Pressable>

          <View className="mt-6 flex-row flex-wrap items-center gap-1">
            <Text className="text-slate-600 dark:text-slate-400">No account?</Text>
            <Link href={"/sign-up" as Href} asChild>
              <Pressable>
                <Text className="font-semibold text-blue-600">Sign up</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
