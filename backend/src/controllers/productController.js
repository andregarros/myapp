import * as productService from "../services/productService.js";

export function list(req, res, next) {
  try {
    res.json(productService.listProducts(req.user.companyId));
  } catch (error) {
    next(error);
  }
}

export async function lookup(req, res, next) {
  try {
    const result = await productService.findProductByBarcode(req.user.companyId, req.params.barcode);
    productService.logScan(req.user.companyId, req.user.sub, req.params.barcode, result.product);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export function create(req, res, next) {
  try {
    res.status(201).json(productService.createProduct(req.user.companyId, req.body));
  } catch (error) {
    next(error);
  }
}

export function upload(req, res, next) {
  try {
    if (!req.file) {
      throw new Error("Arquivo nao enviado.");
    }

    res.status(201).json({
      imageUrl: `http://localhost:4000/uploads/${req.file.filename}`,
    });
  } catch (error) {
    next(error);
  }
}

export function update(req, res, next) {
  try {
    res.json(productService.updateProduct(req.user.companyId, req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

export function remove(req, res, next) {
  try {
    res.json(productService.removeProduct(req.user.companyId, req.params.id));
  } catch (error) {
    next(error);
  }
}
