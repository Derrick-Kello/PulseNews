import Constants from "expo-constants";

export function getNewsApiKey(): string {
  const extra = Constants.expoConfig?.extra as { newsApiKey?: string } | undefined;
  return extra?.newsApiKey ?? "";
}

export function getGNewsApiKey(): string {
  const extra = Constants.expoConfig?.extra as { gnewsApiKey?: string } | undefined;
  return extra?.gnewsApiKey ?? "";
}

export function getClerkPublishableKey(): string {
  const extra = Constants.expoConfig?.extra as { clerkPublishableKey?: string } | undefined;
  return (
    extra?.clerkPublishableKey ??
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ??
    ""
  );
}
