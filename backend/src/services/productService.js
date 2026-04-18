import { v4 as uuid } from "uuid";
import { store } from "../data/store.js";
import { ApiError } from "../utils/errors.js";

async function fetchExternalProduct(barcode) {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();

    if (data.status !== 1) {
      return null;
    }

    return {
      barcode,
      codeType: barcode.length === 8 ? "EAN-8" : "EAN-13",
      name: data.product.product_name || "Produto importado",
      description: data.product.generic_name || data.product.ingredients_text || "Sem descricao externa.",
      category: data.product.categories_tags?.[0]?.replace("en:", "") || "Sem categoria",
      imageUrl: data.product.image_url || "",
      price: 0,
      stock: 0,
    };
  } catch {
    return null;
  }
}

export function listProducts(companyId) {
  return store.collection("products").filter((product) => product.companyId === companyId);
}

export async function findProductByBarcode(companyId, barcode) {
  const local = listProducts(companyId).find((product) => product.barcode === barcode);
  if (local) {
    return { source: "local", product: local };
  }

  const external = await fetchExternalProduct(barcode);
  if (external) {
    return { source: "external", product: external };
  }

  throw new ApiError(404, "Produto nao encontrado.");
}

export function createProduct(companyId, payload) {
  const now = new Date().toISOString();
  const product = {
    id: uuid(),
    companyId,
    barcode: payload.barcode,
    codeType: payload.codeType || "EAN-13",
    name: payload.name,
    description: payload.description || "",
    price: Number(payload.price || 0),
    stock: Number(payload.stock || 0),
    category: payload.category || "Sem categoria",
    imageUrl: payload.imageUrl || "",
    createdAt: now,
    updatedAt: now,
  };

  store.updateCollection("products", (items) => [...items, product]);
  maybeCreateLowStockNotification(product);
  return product;
}

export function updateProduct(companyId, productId, payload) {
  let updated;

  store.updateCollection("products", (items) =>
    items.map((product) => {
      if (product.id !== productId || product.companyId !== companyId) {
        return product;
      }

      updated = {
        ...product,
        ...payload,
        price: payload.price !== undefined ? Number(payload.price) : product.price,
        stock: payload.stock !== undefined ? Number(payload.stock) : product.stock,
        updatedAt: new Date().toISOString(),
      };

      return updated;
    })
  );

  if (!updated) {
    throw new ApiError(404, "Produto nao encontrado.");
  }

  maybeCreateLowStockNotification(updated);
  return updated;
}

export function removeProduct(companyId, productId) {
  const existing = listProducts(companyId).find((product) => product.id === productId);
  if (!existing) {
    throw new ApiError(404, "Produto nao encontrado.");
  }

  store.updateCollection("products", (items) =>
    items.filter((product) => !(product.id === productId && product.companyId === companyId))
  );

  return { success: true };
}

export function logScan(companyId, userId, barcode, result) {
  const entry = {
    id: uuid(),
    companyId,
    userId,
    barcode,
    productId: result?.id || null,
    productName: result?.name || "Nao identificado",
    createdAt: new Date().toISOString(),
  };

  store.updateCollection("scanHistory", (items) => [entry, ...items].slice(0, 300));
  return entry;
}

function maybeCreateLowStockNotification(product) {
  if (product.stock > 10) {
    return;
  }

  const notification = {
    id: uuid(),
    companyId: product.companyId,
    title: "Estoque baixo",
    message: `${product.name} esta com ${product.stock} unidades.`,
    type: "warning",
    read: false,
    createdAt: new Date().toISOString(),
  };

  store.updateCollection("notifications", (items) => [notification, ...items]);
}

