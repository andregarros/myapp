import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1f8f4e",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Escanear" }} />
      <Tabs.Screen name="cart" options={{ title: "Carrinho" }} />
      <Tabs.Screen name="history" options={{ title: "Historico" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}

