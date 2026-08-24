/* eslint-disable react-hooks/exhaustive-deps */
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import ToastHost from "../components/ToastHost";
import { useAuth } from "../lib/useAuth";

export default function RootLayout() {
  const { session, loading, awaitingOtp } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inVerifyRoute = segments[1] === "verify";

    if (awaitingOtp && inVerifyRoute) {
      return;
    }

    if (awaitingOtp && !inVerifyRoute) {
      router.replace("/(auth)/verify");
      return;
    }

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/request");
      return;
    }

    if (session && inAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [segments, session, loading, awaitingOtp]);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <ToastHost />
    </View>
  );
}
