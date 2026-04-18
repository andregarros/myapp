import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import * as productController from "../controllers/productController.js";
import { requireRole } from "../middleware/authMiddleware.js";
import { requireFields, validateProductPayload } from "../middleware/validateMiddleware.js";
import { ApiError } from "../utils/errors.js";

const router = Router();
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(currentDir, "..", "..", "uploads");
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(new ApiError(400, "Formato de imagem invalido."));
      return;
    }
    cb(null, true);
  },
});

router.get("/", productController.list);
router.get("/lookup/:barcode", productController.lookup);
router.post("/upload", requireRole("admin", "employee"), upload.single("image"), productController.upload);
router.post("/", requireRole("admin", "employee"), requireFields(["name", "barcode", "price"]), validateProductPayload, productController.create);
router.put("/:id", requireRole("admin", "employee"), validateProductPayload, productController.update);
router.delete("/:id", requireRole("admin"), productController.remove);

export default router;
