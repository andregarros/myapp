import { useState } from "react";
import { api } from "../api/client";
import { useApp } from "../contexts/AppContext";

export function useBarcodeLookup() {
  const { token, queueOfflineScan } = useApp();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function lookup(barcode) {
    setLoading(true);
    setError("");

    try {
      const result = await api(`/products/lookup/${barcode}`, {
        token,
      });
      setProduct(result.product);
      return result.product;
    } catch (err) {
      queueOfflineScan({
        barcode,
        productName: "Leitura offline pendente",
        createdAt: new Date().toISOString(),
      });
      setProduct(null);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { product, error, loading, lookup, setProduct };
}

