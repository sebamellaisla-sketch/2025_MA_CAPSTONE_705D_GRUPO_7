// backend/src/routes/order.routes.js
import { Router } from "express";
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";

const router = Router();

// Rutas para usuarios autenticados
router.post("/", verifyToken, createOrder);              // POST /api/orders (crear pedido)
router.get("/my-orders", verifyToken, getMyOrders);      // GET /api/orders/my-orders

// Rutas solo para admin
router.get("/", verifyToken, isAdmin, getAllOrders);     // GET /api/orders (todos los pedidos)
router.patch("/:id/status", verifyToken, isAdmin, updateOrderStatus); // PATCH /api/orders/:id/status

export default router;