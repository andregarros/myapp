import NetInfo from "@react-native-community/netinfo";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";
import { readStorage, writeStorage } from "../storage/localStore";
import { readSecureSession, writeSecureSession } from "../storage/secureSession";

const AppContext = createContext(null);
const SESSION_KEY = "smartmarket:mobile:session";
const CART_KEY = "smartmarket:mobile:cart";
const OFFLINE_KEY = "smartmarket:mobile:offline";

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [cart, setCart] = useState([]);
  const [offlineQueue, setOfflineQueue] = useState({ scans: [], purchases: [] });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    Promise.all([
      readSecureSession(SESSION_KEY),
      readStorage(CART_KEY, []),
      readStorage(OFFLINE_KEY, { scans: [], purchases: [] }),
    ]).then(([savedSession, savedCart, savedQueue]) => {
      setSession(savedSession);
      setCart(savedCart);
      setOfflineQueue(savedQueue);
      setInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (!initialized) return;
    writeSecureSession(SESSION_KEY, session);
  }, [initialized, session]);

  useEffect(() => {
    if (!initialized) return;
    writeStorage(CART_KEY, cart);
  }, [initialized, cart]);

  useEffect(() => {
    if (!initialized) return;
    writeStorage(OFFLINE_KEY, offlineQueue);
  }, [initialized, offlineQueue]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && session?.token) {
        syncOffline();
      }
    });

    return unsubscribe;
  }, [offlineQueue, session]);

  async function login(email, password) {
    const result = await api("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setSession(result);
  }

  async function register(payload) {
    const result = await api("/auth/register", {
      method: "POST",
      body: payload,
    });
    setSession(result);
  }

  function logout() {
    setSession(null);
    setCart([]);
  }

  function updateSession(patch) {
    setSession((current) => (current ? { ...current, ...patch } : current));
  }

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(productId) {
    setCart((current) => current.filter((item) => item.productId !== productId));
  }

  function queueOfflineScan(scan) {
    setOfflineQueue((current) => ({ ...current, scans: [scan, ...current.scans] }));
  }

  async function checkout() {
    if (!session?.token) return;

    try {
      const purchase = await api("/cart/checkout", {
        method: "POST",
        token: session.token,
        body: { items: cart },
      });
      setCart([]);
      return purchase;
    } catch {
      const offlinePurchase = {
        items: cart,
        subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        discount: 0,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        paymentMethod: "offline",
        createdAt: new Date().toISOString(),
      };
      setOfflineQueue((current) => ({
        ...current,
        purchases: [offlinePurchase, ...current.purchases],
      }));
      setCart([]);
      return offlinePurchase;
    }
  }

  async function syncOffline() {
    if (!session?.token || (!offlineQueue.scans.length && !offlineQueue.purchases.length)) {
      return;
    }

    await api("/sync/offline", {
      method: "POST",
      token: session.token,
      body: offlineQueue,
    });

    setOfflineQueue({ scans: [], purchases: [] });
  }

  return (
    <AppContext.Provider
      value={{
        initialized,
        session,
        token: session?.token,
        user: session?.user,
        company: session?.company,
        subscription: session?.subscription,
        cart,
        offlineQueue,
        login,
        register,
        logout,
        updateSession,
        addToCart,
        removeFromCart,
        queueOfflineScan,
        checkout,
        syncOffline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
