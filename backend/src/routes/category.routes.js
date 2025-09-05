// backend/src/routes/category.routes.js
import { Router } from "express";
import { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../controllers/category.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";

const router = Router();

// Rutas públicas
router.get("/", getCategories);         // GET /api/categories
router.get("/:id", getCategory);        // GET /api/categories/:id

// Rutas protegidas (solo admin)
router.post("/", verifyToken, isAdmin, createCategory);       // POST /api/categories
router.put("/:id", verifyToken, isAdmin, updateCategory);     // PUT /api/categories/:id
router.delete("/:id", verifyToken, isAdmin, deleteCategory);  // DELETE /api/categories/:id

export default router;