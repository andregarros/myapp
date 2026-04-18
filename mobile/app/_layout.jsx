import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider, useApp } from "../src/contexts/AppContext";
import { AuthGate } from "../src/components/AuthGate";
import { ActivityIndicator, View } from "react-native";

function RootNavigation() {
  const { initialized, session } = useApp();

  if (!initialized) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <AuthGate />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function Layout() {
  return (
    <AppProvider>
      <RootNavigation />
    </AppProvider>
  );
}

