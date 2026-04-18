import { getHistory } from "../services/historyService.js";

export function list(req, res, next) {
  try {
    const userId = req.user.role === "customer" ? req.user.sub : undefined;
    res.json(getHistory(req.user.companyId, userId));
  } catch (error) {
    next(error);
  }
}

