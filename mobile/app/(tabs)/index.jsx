import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ProductCard } from "../../src/components/ProductCard";
import { useApp } from "../../src/contexts/AppContext";
import { useBarcodeLookup } from "../../src/hooks/useBarcodeLookup";

const barcodeTypes = ["ean13", "ean8", "qr"];

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannerActive, setScannerActive] = useState(false);
  const [lastScanned, setLastScanned] = useState("");
  const lockRef = useRef(false);
  const { addToCart } = useApp();
  const { product, error, loading, lookup } = useBarcodeLookup();

  useEffect(() => {
    async function handleCameraFlow() {
      if (!permission) {
        return;
      }

      if (permission.granted) {
        setScannerActive(true);
        return;
      }

      const result = await requestPermission();
      if (result.granted) {
        setScannerActive(true);
      }
    }

    handleCameraFlow();
  }, [permission, requestPermission]);

  async function handleBarcodeScanned({ data }) {
    if (lockRef.current || data === lastScanned) {
      return;
    }

    lockRef.current = true;
    setLastScanned(data);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await lookup(data);

    setTimeout(() => {
      lockRef.current = false;
    }, 1200);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.eyebrow}>Scanner inteligente</Text>
        <Text style={styles.title}>Leia produtos em tempo real</Text>
        <Text style={styles.subtitle}>
          Ao abrir o app, a camera inicia automaticamente quando a permissao ja existe ou assim que o usuario aceitar.
        </Text>
      </View>

      <View style={styles.cameraCard}>
        {scannerActive ? (
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes }}
            onBarcodeScanned={handleBarcodeScanned}
          />
        ) : (
          <View style={styles.permissionBox}>
            <Text style={styles.permissionText}>Aguardando permissao da camera.</Text>
            <Pressable style={styles.primaryButton} onPress={requestPermission}>
              <Text style={styles.primaryButtonText}>Permitir camera</Text>
            </Pressable>
          </View>
        )}
      </View>

      {loading ? <Text>Buscando produto...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {product ? (
        <ProductCard product={product} actionLabel="Adicionar ao carrinho" onAction={() => addToCart(product)} />
      ) : (
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Pronto para escanear</Text>
          <Text style={styles.subtitle}>EAN-13, EAN-8 e QR Code sao suportados.</Text>
        </View>
      )}
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
    gap: 16,
  },
  headerCard: {
    backgroundColor: "#173c23",
    borderRadius: 28,
    padding: 20,
    gap: 8,
  },
  eyebrow: {
    color: "#9fe2b4",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "800",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#d6eadb",
    lineHeight: 22,
  },
  cameraCard: {
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#fff",
    minHeight: 320,
  },
  camera: {
    height: 320,
  },
  permissionBox: {
    minHeight: 320,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    padding: 24,
  },
  permissionText: {
    fontSize: 16,
    color: "#355041",
  },
  primaryButton: {
    backgroundColor: "#1f8f4e",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 18,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  tipCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    gap: 6,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#17301f",
  },
  error: {
    color: "#c64d3f",
  },
});

