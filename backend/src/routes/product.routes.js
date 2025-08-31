import express from "express";
const router = express.Router();

// Controladores
import {
  getProducts,
  getProduct,
  addProduct,
} from "../controllers/productController.js";

// Middlewares
import { verifyToken, requireAdmin } from "../middlewares/auth.js";

/**
 * Ruta pública: obtiene todos los productos
 */
router.get("/", getProducts);

/**
 * Ruta pública: obtiene un producto por ID
 */
router.get("/:id", getProduct);

/**
 * Ruta protegida: solo admin puede crear productos
 */
router.post("/", verifyToken, requireAdmin, addProduct);

export default router;