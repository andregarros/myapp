import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useApp } from "../contexts/AppContext";

export function AuthGate() {
  const { login, register } = useApp();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
  });

  async function handleSubmit() {
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Scanner inteligente</Text>
        <Text style={styles.title}>Seu mercado na palma da mao</Text>

        {mode === "register" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome do admin"
              value={form.name}
              onChangeText={(value) => setForm({ ...form, name: value })}
            />
            <TextInput
              style={styles.input}
              placeholder="Nome da empresa"
              value={form.companyName}
              onChangeText={(value) => setForm({ ...form, companyName: value })}
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(value) => setForm({ ...form, email: value })}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={form.password}
          onChangeText={(value) => setForm({ ...form, password: value })}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>{mode === "login" ? "Entrar" : "Cadastrar"}</Text>
        </Pressable>

        <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")}>
          <Text style={styles.linkText}>
            {mode === "login" ? "Criar empresa e admin" : "Ja tenho conta"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4eb",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 24,
    gap: 14,
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "800",
    color: "#1b8d4b",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#17301f",
  },
  input: {
    backgroundColor: "#f6faf4",
    borderRadius: 18,
    padding: 14,
  },
  primaryButton: {
    backgroundColor: "#1f8f4e",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  linkText: {
    color: "#0e5f31",
    textAlign: "center",
    fontWeight: "700",
  },
  error: {
    color: "#c64d3f",
  },
});
