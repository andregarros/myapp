import { syncOfflinePayload } from "../services/syncService.js";

export function sync(req, res, next) {
  try {
    res.json(syncOfflinePayload(req.user.companyId, req.user.sub, req.body));
  } catch (error) {
    next(error);
  }
}

