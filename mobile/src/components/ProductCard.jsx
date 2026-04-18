import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export function ProductCard({ product, actionLabel, onAction }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: product.imageUrl || "https://via.placeholder.com/400x240.png?text=Produto" }}
        style={styles.image}
      />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.meta}>{product.category}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>R$ {product.price}</Text>
          <Text style={styles.meta}>Estoque: {product.stock ?? "N/A"}</Text>
        </View>
        {onAction ? (
          <Pressable style={styles.button} onPress={onAction}>
            <Text style={styles.buttonText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    gap: 10,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#17301f",
  },
  meta: {
    color: "#607767",
  },
  description: {
    color: "#355041",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
  },
  button: {
    backgroundColor: "#1f8f4e",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
  },
});

