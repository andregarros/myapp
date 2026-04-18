import { store } from "../data/store.js";
import { lowStockProducts } from "../utils/formatters.js";
import { getCompany, getSubscription } from "./subscriptionService.js";

export function getDashboard(companyId) {
  const products = store.collection("products").filter((product) => product.companyId === companyId);
  const purchases = store.collection("purchases").filter((purchase) => purchase.companyId === companyId);
  const scanHistory = store.collection("scanHistory").filter((scan) => scan.companyId === companyId);

  const salesTotal = purchases.reduce((sum, purchase) => sum + purchase.total, 0);

  return {
    company: getCompany(companyId),
    subscription: getSubscription(companyId),
    metrics: {
      totalProducts: products.length,
      totalSales: Number(salesTotal.toFixed(2)),
      lowStock: lowStockProducts(products).length,
      scansToday: scanHistory.filter((scan) => scan.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
    },
    lowStockProducts: lowStockProducts(products),
    recentPurchases: purchases.slice(0, 5),
    recentScans: scanHistory.slice(0, 10),
  };
}
