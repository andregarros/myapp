import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../../src/api/client";
import { useApp } from "../../src/contexts/AppContext";

export default function ProfileScreen() {
  const { user, company, subscription, token, offlineQueue, syncOffline, logout, updateSession } = useApp();

  async function renewSubscription() {
    const renewed = await api("/subscription/renew", {
      method: "POST",
      token,
    });
    updateSession({ subscription: renewed });
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Conta</Text>
        <Text style={styles.title}>{user?.name}</Text>
        <Text style={styles.meta}>Empresa: {company?.name}</Text>
        <Text style={styles.meta}>{user?.email}</Text>
        <Text style={styles.meta}>Perfil: {user?.role}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Assinatura</Text>
        <Text style={styles.meta}>Plano: {subscription?.plan}</Text>
        <Text style={styles.meta}>Status: {subscription?.status}</Text>
        <Text style={styles.meta}>
          Renovacao: {subscription?.renewAt ? new Date(subscription.renewAt).toLocaleDateString("pt-BR") : "-"}
        </Text>

        {user?.role === "admin" && (
          <Pressable style={styles.primaryButton} onPress={renewSubscription}>
            <Text style={styles.primaryButtonText}>Renovar mensalidade</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Sincronizacao offline</Text>
        <Text style={styles.meta}>Leituras pendentes: {offlineQueue.scans.length}</Text>
        <Text style={styles.meta}>Compras pendentes: {offlineQueue.purchases.length}</Text>

        <Pressable style={styles.primaryButton} onPress={syncOffline}>
          <Text style={styles.primaryButtonText}>Sincronizar agora</Text>
        </Pressable>
      </View>

      <Pressable style={styles.secondaryButton} onPress={logout}>
        <Text style={styles.secondaryButtonText}>Sair</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eef4eb",
  },
  content: {
    padding: 18,
    gap: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    gap: 8,
  },
  eyebrow: {
    color: "#1f8f4e",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "800",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#17301f",
  },
  meta: {
    color: "#607767",
  },
  primaryButton: {
    marginTop: 10,
    backgroundColor: "#1f8f4e",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "#173c23",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
});
