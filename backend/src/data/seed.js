const now = new Date().toISOString();
const renewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

export const seedData = {
  companies: [
    {
      id: "company-1",
      name: "Mercado Central",
      plan: "enterprise",
      ownerUserId: "user-admin",
      createdAt: now,
    },
  ],
  subscriptions: [
    {
      id: "subscription-1",
      companyId: "company-1",
      plan: "enterprise",
      status: "active",
      amount: 199.9,
      currency: "BRL",
      billingCycle: "monthly",
      startedAt: now,
      renewAt: renewalDate,
      lastRenewedAt: now,
      createdAt: now,
      updatedAt: now
    }
  ],
  users: [
    {
      id: "user-admin",
      companyId: "company-1",
      name: "Administrador",
      email: "admin@smartmarket.com",
      passwordHash: "$2a$10$N9qo8uLOickgx2ZMRZo4i.ejRMQgu2xYp8D66zCFAaj6MqFmoVoeW",
      role: "admin",
      createdAt: now,
    },
    {
      id: "user-staff",
      companyId: "company-1",
      name: "Funcionario",
      email: "staff@smartmarket.com",
      passwordHash: "$2a$10$G8H6FvP3Yf7i5T4F4vQYbOcFfIfT2x2hd3nl9l0eYqYI07CqJrJ8u",
      role: "employee",
      createdAt: now,
    },
    {
      id: "user-client",
      companyId: "company-1",
      name: "Cliente",
      email: "customer@smartmarket.com",
      passwordHash: "$2a$10$tvhx9Q78l9v74nly1PkH3.Vi1dQ4wr9PXgC7cmRlQCk2BEm90Lk6G",
      role: "customer",
      createdAt: now,
    },
  ],
  products: [
    {
      id: "product-1",
      companyId: "company-1",
      barcode: "7891000100103",
      codeType: "EAN-13",
      name: "Arroz Tipo 1 5kg",
      description: "Arroz branco premium para o dia a dia.",
      price: 28.9,
      stock: 40,
      category: "Mercearia",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "product-2",
      companyId: "company-1",
      barcode: "7894900011517",
      codeType: "EAN-13",
      name: "Cafe Torrado 500g",
      description: "Cafe encorpado e aroma intenso.",
      price: 16.75,
      stock: 8,
      category: "Bebidas",
      imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
      createdAt: now,
      updatedAt: now,
    }
  ],
  scanHistory: [],
  purchases: [],
  notifications: [
    {
      id: "notif-1",
      companyId: "company-1",
      title: "Estoque baixo",
      message: "Cafe Torrado 500g esta com 8 unidades.",
      type: "warning",
      read: false,
      createdAt: now,
    }
  ]
};
