import { simulatePurchase } from "../services/cartService.js";

export function checkout(req, res, next) {
  try {
    const purchase = simulatePurchase(req.user.companyId, req.user.sub, req.body.items || []);
    res.status(201).json(purchase);
  } catch (error) {
    next(error);
  }
}

