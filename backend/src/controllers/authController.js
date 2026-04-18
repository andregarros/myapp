import * as authService from "../services/authService.js";

export function login(req, res, next) {
  try {
    res.json(authService.login(req.body.email, req.body.password));
  } catch (error) {
    next(error);
  }
}

export function register(req, res, next) {
  try {
    res.status(201).json(authService.register(req.body));
  } catch (error) {
    next(error);
  }
}

