export function calculateCartTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal > 150 ? subtotal * 0.03 : 0;
  const total = subtotal - discount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}

export function lowStockProducts(products) {
  return products.filter((product) => product.stock <= 10);
}
