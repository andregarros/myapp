import { v4 as uuid } from "uuid";
import { store } from "../data/store.js";

export function syncOfflinePayload(companyId, userId, payload) {
  const scans = (payload.scans || []).map((scan) => ({
    id: uuid(),
    companyId,
    userId,
    barcode: scan.barcode,
    productId: scan.productId || null,
    productName: scan.productName || "Offline scan",
    createdAt: scan.createdAt || new Date().toISOString(),
  }));

  const purchases = (payload.purchases || []).map((purchase) => ({
    id: uuid(),
    companyId,
    userId,
    items: purchase.items || [],
    subtotal: Number(purchase.subtotal || 0),
    discount: Number(purchase.discount || 0),
    total: Number(purchase.total || 0),
    paymentMethod: purchase.paymentMethod || "offline-sync",
    status: "synced",
    createdAt: purchase.createdAt || new Date().toISOString(),
  }));

  if (scans.length) {
    store.updateCollection("scanHistory", (items) => [...scans, ...items]);
  }

  if (purchases.length) {
    store.updateCollection("purchases", (items) => [...purchases, ...items]);
  }

  return {
    syncedScans: scans.length,
    syncedPurchases: purchases.length,
  };
}

