import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "../config/env.js";
import { seedData } from "./seed.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(currentDir, "..", "..", "data");
const dbFile = path.join(dataDir, "db.json");
const memoryStoreKey = "__SMART_MARKET_MEMORY_DB__";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getMemoryDb() {
  if (!globalThis[memoryStoreKey]) {
    globalThis[memoryStoreKey] = clone(seedData);
  }

  return globalThis[memoryStoreKey];
}

class DataStore {
  constructor() {
    if (env.dataStoreMode === "memory") {
      this.ensureMemoryShape();
      return;
    }

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, JSON.stringify(seedData, null, 2));
    }

    this.ensureShape();
  }

  read() {
    if (env.dataStoreMode === "memory") {
      return this.normalize(clone(getMemoryDb()));
    }

    const db = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
    return this.normalize(db);
  }

  write(data) {
    if (env.dataStoreMode === "memory") {
      globalThis[memoryStoreKey] = this.normalize(clone(data));
      return globalThis[memoryStoreKey];
    }

    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    return data;
  }

  collection(name) {
    const db = this.read();
    return db[name] || [];
  }

  updateCollection(name, updater) {
    const db = this.read();
    db[name] = updater(db[name] || []);
    this.write(db);
    return db[name];
  }

  ensureShape() {
    if (env.dataStoreMode === "memory") {
      this.ensureMemoryShape();
      return;
    }

    const db = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
    const normalized = this.normalize(db);
    if (JSON.stringify(db) !== JSON.stringify(normalized)) {
      fs.writeFileSync(dbFile, JSON.stringify(normalized, null, 2));
    }
  }

  normalize(db) {
    const normalized = { ...db };

    for (const [key, value] of Object.entries(seedData)) {
      if (!Array.isArray(normalized[key])) {
        normalized[key] = value;
      }
    }

    normalized.companies = normalized.companies.map((company) => ({
      ownerUserId: company.ownerUserId || null,
      ...company,
    }));

    if (!normalized.subscriptions.length && normalized.companies.length) {
      const now = new Date().toISOString();
      normalized.subscriptions = normalized.companies.map((company, index) => ({
        id: `migrated-subscription-${index + 1}`,
        companyId: company.id,
        plan: company.plan || "professional",
        status: "active",
        amount: company.plan === "enterprise" ? 199.9 : 149.9,
        currency: "BRL",
        billingCycle: "monthly",
        startedAt: now,
        renewAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastRenewedAt: now,
        createdAt: now,
        updatedAt: now,
      }));
    }

    return normalized;
  }

  ensureMemoryShape() {
    globalThis[memoryStoreKey] = this.normalize(clone(getMemoryDb()));
  }
}

export const store = new DataStore();
