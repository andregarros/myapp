import { store } from "../data/store.js";

export function getHistory(companyId, userId) {
  const scanHistory = store.collection("scanHistory").filter((entry) => entry.companyId === companyId);
  const purchases = store.collection("purchases").filter((entry) => entry.companyId === companyId);

  return {
    scans: userId ? scanHistory.filter((entry) => entry.userId === userId) : scanHistory,
    purchases: userId ? purchases.filter((entry) => entry.userId === userId) : purchases,
  };
}

