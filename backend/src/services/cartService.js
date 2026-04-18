import { v4 as uuid } from "uuid";
import { store } from "../data/store.js";
import { ApiError } from "../utils/errors.js";
import { calculateCartTotals } from "../utils/formatters.js";

export function simulatePurchase(companyId, userId, items) {
  const products = store.collection("products").filter((product) => product.companyId === companyId);

  const normalizedItems = items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) {
      throw new ApiError(404, `Produto ${item.productId} nao encontrado.`);
    }

    if (product.stock < item.quantity) {
      throw new ApiError(400, `Estoque insuficiente para ${product.name}.`);
    }

    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: Number(item.quantity),
    };
  });

  const totals = calculateCartTotals(normalizedItems);
  const purchase = {
    id: uuid(),
    companyId,
    userId,
    items: normalizedItems,
    paymentMethod: "simulation",
    status: "completed",
    ...totals,
    createdAt: new Date().toISOString(),
  };

  store.updateCollection("purchases", (entries) => [purchase, ...entries]);
  store.updateCollection("products", (entries) =>
    entries.map((product) => {
      const sold = normalizedItems.find((item) => item.productId === product.id);
      if (!sold) {
        return product;
      }

      return {
        ...product,
        stock: product.stock - sold.quantity,
        updatedAt: new Date().toISOString(),
      };
    })
  );

  return purchase;
}

