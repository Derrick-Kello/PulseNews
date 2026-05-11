import { useSignUp } from "@clerk/expo";
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

export default function SignUpScreen() {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"form" | "verify">("form");

  const busy = fetchStatus === "fetching";

  const handleRegister = async () => {
    if (!signUp) return;

    const { error } = await signUp.password({
      emailAddress,
      password,
    });

    if (error) {
      Alert.alert("Sign up failed", error.message ?? "Could not create account.");
      return;
    }

    if (signUp.status === "complete") {
      const fin = await signUp.finalize({
        navigate: (opts) => navigateAfterSession({ ...opts, router }),
      });
      if (fin.error) {
        Alert.alert("Sign up failed", fin.error.message ?? "Could not finish sign-up.");
      }
      return;
    }

    const send = await signUp.verifications.sendEmailCode();
    if (send.error) {
      Alert.alert("Verification", send.error.message ?? "Could not send verification email.");
      return;
    }
    setPhase("verify");
  };

  const handleVerify = async () => {
    if (!signUp) return;

    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      Alert.alert("Invalid code", error.message ?? "Try again.");
      return;
    }

    if (signUp.status === "complete") {
      const fin = await signUp.finalize({
        navigate: (opts) => navigateAfterSession({ ...opts, router }),
      });
      if (fin.error) {
        Alert.alert("Sign up failed", fin.error.message ?? "Could not finish sign-up.");
      }
    }
  };

  if (phase === "verify") {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <Text className="text-base text-slate-600 dark:text-slate-300">
              Enter the verification code sent to your email.
            </Text>
            <Text className="mb-1 mt-6 text-sm font-semibold text-slate-700 dark:text-slate-200">Code</Text>
            <TextInput
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              placeholder="123456"
              placeholderTextColor="#94a3b8"
            />
            <Pressable
              disabled={busy || !code}
              onPress={() => void handleVerify()}
              className="mt-6 items-center rounded-2xl bg-blue-600 py-4 disabled:opacity-50"
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-base font-semibold text-white">Verify and continue</Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => void signUp?.verifications.sendEmailCode()}
              className="mt-4 items-center py-2"
            >
              <Text className="font-semibold text-blue-600">Resend code</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
            Create an account. You may need to verify your email with a code.
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

          {Platform.OS === "web" ? <View nativeID="clerk-captcha" className="mt-4 min-h-[1px]" /> : null}

          <Pressable
            disabled={busy || !emailAddress || !password}
            onPress={() => void handleRegister()}
            className="mt-6 items-center rounded-2xl bg-blue-600 py-4 disabled:opacity-50"
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-semibold text-white">Sign up</Text>
            )}
          </Pressable>

          <View className="mt-6 flex-row flex-wrap items-center gap-1">
            <Text className="text-slate-600 dark:text-slate-400">Already have an account?</Text>
            <Link href={"/sign-in" as Href} asChild>
              <Pressable>
                <Text className="font-semibold text-blue-600">Sign in</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
