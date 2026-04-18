import { ApiError } from "../utils/errors.js";

export function requireFields(fields) {
  return (req, _res, next) => {
    const missing = fields.filter((field) => req.body[field] === undefined || req.body[field] === "");
    if (missing.length) {
      return next(new ApiError(400, `Campos obrigatorios: ${missing.join(", ")}`));
    }
    return next();
  };
}

export function validateAuthPayload(req, _res, next) {
  const { name, companyName, email, password } = req.body;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    return next(new ApiError(400, "Email invalido."));
  }

  if (password) {
    const normalized = String(password);
    const strongEnough =
      normalized.length >= 8 &&
      /[A-Z]/.test(normalized) &&
      /[a-z]/.test(normalized) &&
      /\d/.test(normalized);

    if (!strongEnough) {
      return next(
        new ApiError(400, "A senha deve ter ao menos 8 caracteres, com maiuscula, minuscula e numero.")
      );
    }
  }

  if (name !== undefined && String(name).trim().length < 2) {
    return next(new ApiError(400, "Nome invalido."));
  }

  if (companyName !== undefined && String(companyName).trim().length < 2) {
    return next(new ApiError(400, "Nome da empresa invalido."));
  }

  return next();
}

export function validateProductPayload(req, _res, next) {
  const { name, barcode, price, stock, category } = req.body;

  if (name !== undefined && String(name).trim().length < 2) {
    return next(new ApiError(400, "Nome do produto invalido."));
  }

  if (barcode !== undefined && !/^[0-9A-Za-z-]{6,32}$/.test(String(barcode).trim())) {
    return next(new ApiError(400, "Codigo de barras invalido."));
  }

  if (price !== undefined && (!Number.isFinite(Number(price)) || Number(price) < 0)) {
    return next(new ApiError(400, "Preco invalido."));
  }

  if (stock !== undefined && (!Number.isInteger(Number(stock)) || Number(stock) < 0)) {
    return next(new ApiError(400, "Estoque invalido."));
  }

  if (category !== undefined && String(category).length > 100) {
    return next(new ApiError(400, "Categoria muito longa."));
  }

  return next();
}
