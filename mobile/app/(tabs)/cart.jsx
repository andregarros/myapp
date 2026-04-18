import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useApp } from "../../src/contexts/AppContext";

export default function CartScreen() {
  const { cart, removeFromCart, checkout, offlineQueue } = useApp();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout() {
    await checkout();
    Alert.alert("Compra registrada", "A compra foi concluida ou armazenada para sincronizacao offline.");
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.summaryCard}>
        <Text style={styles.title}>Carrinho</Text>
        <Text style={styles.total}>R$ {total.toFixed(2)}</Text>
        <Text style={styles.subtitle}>
          Pendencias offline: {offlineQueue.purchases.length} compras e {offlineQueue.scans.length} leituras.
        </Text>
      </View>

      {cart.map((item) => (
        <View style={styles.itemCard} key={item.productId}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.subtitle}>
              {item.quantity} x R$ {item.price}
            </Text>
          </View>
          <Pressable style={styles.secondaryButton} onPress={() => removeFromCart(item.productId)}>
            <Text style={styles.secondaryButtonText}>Remover</Text>
          </Pressable>
        </View>
      ))}

      <Pressable style={styles.primaryButton} onPress={handleCheckout} disabled={!cart.length}>
        <Text style={styles.primaryButtonText}>Simular compra</Text>
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
  summaryCard: {
    backgroundColor: "#173c23",
    borderRadius: 28,
    padding: 20,
    gap: 6,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  total: {
    color: "#9fe2b4",
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    color: "#597161",
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#17301f",
  },
  primaryButton: {
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
    backgroundColor: "#eef4eb",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  secondaryButtonText: {
    color: "#17301f",
    fontWeight: "700",
  },
});

