import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { isSignedIn, isLoading, user } = useAuth();
  const [appReady, setAppReady] = React.useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAppReady(true);
      } catch (error) {
        console.error("App initialization error:", error);
        setAppReady(true);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (!isLoading && appReady) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, appReady]);

  // ✅ FIX: Debug logging
  console.log("📊 RootLayoutNav state:", {
    isSignedIn,
    isLoading,
    appReady,
    userType: user?.user_type,
  });

  if (isLoading || !appReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "white" },
      }}
    >
      {isSignedIn && user ? (
        // ✅ FIX:  Render based on user type
        <>
          {user.user_type === "user" && (
            <Stack.Screen name="(user)" options={{ headerShown: false }} />
          )}

          {user.user_type === "service_provider" && (
            <Stack.Screen
              name="(service-provider)"
              options={{ headerShown: false }}
            />
          )}

          {user.user_type === "admin" && (
            <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          )}

          {/* Fallback */}
          {!user.user_type && (
            <Stack.Screen name="(user)" options={{ headerShown: false }} />
          )}
        </>
      ) : (
        // Not signed in
        <>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="+not-found"
            options={{ title: "Oops!", headerShown: true }}
          />
        </>
      )}
    </Stack>
  );
}
