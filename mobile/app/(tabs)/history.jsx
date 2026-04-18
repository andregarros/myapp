import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../../src/api/client";
import { useApp } from "../../src/contexts/AppContext";

export default function HistoryScreen() {
  const { token } = useApp();
  const [history, setHistory] = useState({ scans: [], purchases: [] });
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    if (!token) return;
    const result = await api("/history", { token });
    setHistory(result);
  }

  useEffect(() => {
    load();
  }, [token]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
      }} />}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Historico de leituras</Text>
        {history.scans.map((item) => (
          <View style={styles.row} key={item.id}>
            <Text style={styles.name}>{item.productName}</Text>
            <Text style={styles.meta}>{item.barcode}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Historico de compras</Text>
        {history.purchases.map((item) => (
          <View style={styles.row} key={item.id}>
            <Text style={styles.name}>{item.items.length} itens</Text>
            <Text style={styles.meta}>R$ {item.total}</Text>
          </View>
        ))}
      </View>
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
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#17301f",
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e3ece1",
  },
  name: {
    fontWeight: "700",
    color: "#17301f",
  },
  meta: {
    color: "#607767",
  },
});

