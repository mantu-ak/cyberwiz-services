import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading, isSignedIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // ✅ Navigate based on auth state
  useEffect(() => {
    if (isLoading) return;

    console.log("🎯 Navigation check:", {
      isSignedIn,
      userType: user?.user_type,
    });

    if (!isSignedIn) {
      console.log("➡️ Navigating to login");
      router.replace("/(auth)/login");
    } else {
      // ✅ FIX: Use full route paths with home screen
      if (user?.user_type === "admin") {
        console.log("➡️ Navigating to admin home");
        router.replace("/(admin)/home");
      } else if (user?.user_type === "service_provider") {
        console.log("➡️ Navigating to provider home");
        router.replace("/(service-provider)/home");
      } else {
        console.log("➡️ Navigating to user home");
        router.replace("/(user)/home");
      }
    }
  }, [isLoading, isSignedIn, user?.user_type, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // ✅ Declare ALL screens upfront (no conditionals)
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Auth screens */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* User screens */}
        <Stack.Screen name="(user)" options={{ headerShown: false }} />

        {/* Service Provider screens */}
        <Stack.Screen
          name="(service-provider)"
          options={{ headerShown: false }}
        />

        {/* Admin screens */}
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />

        {/* Not found */}
        <Stack.Screen
          name="+not-found"
          options={{ title: "Oops!", headerShown: true }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
