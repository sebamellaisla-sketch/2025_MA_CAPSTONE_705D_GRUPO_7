// backend/src/routes/product.routes.js
import { Router } from "express";
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "../controllers/product.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";

const router = Router();

// Rutas públicas
router.get("/", getProducts);           // GET /api/products
router.get("/:id", getProduct);         // GET /api/products/:id

// Rutas protegidas (solo admin)
router.post("/", verifyToken, isAdmin, createProduct);       // POST /api/products
router.put("/:id", verifyToken, isAdmin, updateProduct);     // PUT /api/products/:id
router.delete("/:id", verifyToken, isAdmin, deleteProduct);  // DELETE /api/products/:id

export default router;