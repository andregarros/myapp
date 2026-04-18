import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/errors.js";

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Token ausente."));
  }

  try {
    req.user = jwt.verify(header.slice(7), env.jwtSecret);
    return next();
  } catch {
    return next(new ApiError(401, "Token invalido."));
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Acesso negado."));
    }
    return next();
  };
}

