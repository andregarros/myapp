import { v4 as uuid } from "uuid";
import { store } from "../data/store.js";
import { ApiError } from "../utils/errors.js";

const plans = {
  starter: { amount: 79.9, name: "Starter" },
  professional: { amount: 149.9, name: "Professional" },
  enterprise: { amount: 199.9, name: "Enterprise" },
};

function addThirtyDays(from = new Date()) {
  return new Date(from.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
}

export function getCompany(companyId) {
  return store.collection("companies").find((company) => company.id === companyId) || null;
}

export function getSubscription(companyId) {
  const subscription = store.collection("subscriptions").find((entry) => entry.companyId === companyId);
  if (!subscription) {
    throw new ApiError(404, "Assinatura nao encontrada.");
  }

  const isExpired = new Date(subscription.renewAt).getTime() < Date.now();
  if (isExpired && subscription.status !== "expired") {
    let updated;
    store.updateCollection("subscriptions", (items) =>
      items.map((item) => {
        if (item.companyId !== companyId) return item;
        updated = { ...item, status: "expired", updatedAt: new Date().toISOString() };
        return updated;
      })
    );
    return updated;
  }

  return subscription;
}

export function ensureActiveSubscription(companyId) {
  const subscription = getSubscription(companyId);
  if (subscription.status !== "active") {
    throw new ApiError(402, "Assinatura vencida. Renove para continuar usando o sistema.");
  }
  return subscription;
}

export function createCompanyWithAdmin({ companyName, adminName, email, password }) {
  const users = store.collection("users");
  const companies = store.collection("companies");
  const normalizedEmail = String(email).trim().toLowerCase();

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new ApiError(409, "Este email ja esta cadastrado.");
  }

  if (companies.some((company) => company.name.toLowerCase() === String(companyName).trim().toLowerCase())) {
    throw new ApiError(409, "Ja existe uma empresa com esse nome.");
  }

  const companyId = uuid();
  const userId = uuid();
  const subscriptionId = uuid();
  const now = new Date().toISOString();

  const company = {
    id: companyId,
    name: String(companyName).trim(),
    plan: "professional",
    ownerUserId: userId,
    createdAt: now,
  };

  const adminUser = {
    id: userId,
    companyId,
    name: String(adminName).trim(),
    email: normalizedEmail,
    role: "admin",
    passwordHash: password,
    createdAt: now,
  };

  const subscription = {
    id: subscriptionId,
    companyId,
    plan: "professional",
    status: "active",
    amount: plans.professional.amount,
    currency: "BRL",
    billingCycle: "monthly",
    startedAt: now,
    renewAt: addThirtyDays(new Date()),
    lastRenewedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  store.updateCollection("companies", (items) => [...items, company]);
  store.updateCollection("users", (items) => [...items, adminUser]);
  store.updateCollection("subscriptions", (items) => [...items, subscription]);

  return { company, user: adminUser, subscription };
}

export function renewSubscription(companyId, actor) {
  if (actor.role !== "admin") {
    throw new ApiError(403, "Somente o admin da empresa pode renovar a assinatura.");
  }

  let updated;
  store.updateCollection("subscriptions", (items) =>
    items.map((item) => {
      if (item.companyId !== companyId) return item;
      updated = {
        ...item,
        status: "active",
        renewAt: addThirtyDays(new Date()),
        lastRenewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return updated;
    })
  );

  if (!updated) {
    throw new ApiError(404, "Assinatura nao encontrada.");
  }

  store.updateCollection("notifications", (items) => [
    {
      id: uuid(),
      companyId,
      title: "Assinatura renovada",
      message: `Assinatura renovada ate ${new Date(updated.renewAt).toLocaleDateString("pt-BR")}.`,
      type: "success",
      read: false,
      createdAt: new Date().toISOString(),
    },
    ...items,
  ]);

  return updated;
}

export function listCompanies() {
  return store.collection("companies").map((company) => ({
    ...company,
    subscription: store.collection("subscriptions").find((item) => item.companyId === company.id) || null,
  }));
}
