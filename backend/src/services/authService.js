import bcrypt from "bcryptjs";
import { store } from "../data/store.js";
import { ApiError } from "../utils/errors.js";
import { signToken } from "../utils/tokens.js";
import { createCompanyWithAdmin, getCompany, getSubscription } from "./subscriptionService.js";

export function login(email, password) {
  const users = store.collection("users");
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = users.find((entry) => entry.email.toLowerCase() === normalizedEmail);

  if (!user) {
    throw new ApiError(401, "Credenciais invalidas.");
  }

  const hashMatch = bcrypt.compareSync(password, user.passwordHash);

  if (!hashMatch) {
    throw new ApiError(401, "Credenciais invalidas.");
  }

  return {
    token: signToken(user),
    user: {
      id: user.id,
      companyId: user.companyId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    company: getCompany(user.companyId),
    subscription: getSubscription(user.companyId),
  };
}

export function register({ name, companyName, email, password }) {
  const { company, user, subscription } = createCompanyWithAdmin({
    companyName,
    adminName: name,
    email,
    password: bcrypt.hashSync(password, 10),
  });

  return {
    token: signToken(user),
    user: {
      id: user.id,
      companyId: user.companyId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    company,
    subscription,
  };
}
