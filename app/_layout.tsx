import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading, isSignedIn, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Stack>
        {isSignedIn ? (
          // User is authenticated
          <>
            {user?.user_type === "admin" && (
              <Stack.Screen name="(admin)" options={{ headerShown: false }} />
            )}
            {user?.user_type === "service_provider" && (
              <Stack.Screen
                name="(service-provider)"
                options={{ headerShown: false }}
              />
            )}
            {user?.user_type === "user" && (
              <Stack.Screen name="(user)" options={{ headerShown: false }} />
            )}
          </>
        ) : (
          // User is not authenticated
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
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
