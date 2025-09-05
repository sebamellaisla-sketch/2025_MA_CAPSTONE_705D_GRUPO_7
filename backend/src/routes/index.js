// backend/src/routes/index.js
import { Router } from "express";
import userRoutes from "./user.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import quoteRoutes from "./quote.routes.js";
// import orderRoutes from "./order.routes.js";
import webpayRoutes from "./webpay.routes.js";

const router = Router();

/**
 * Ping del router (opcional): GET /api
 * Útil para verificar que el router está montado correctamente.
 */
router.get("/", (_req, res) => {
  res.json({ ok: true, message: "API root", version: "1.0.0" });
});

/**
 * Rutas de negocio
 * Nota: Este router se monta en app.js bajo "/api"
 * Por lo tanto:
 *   - /api/auth/...
 *   - /api/products/...
 *   - /api/categories/...
 *   - /api/quotes/...
 *   - /api/webpay/...  (incluye /create y /commit)
 */
router.use("/auth", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/quotes", quoteRoutes);
// router.use("/orders", orderRoutes);
router.use("/webpay", webpayRoutes);

/**
 * 404 para rutas no encontradas dentro del /api
 */
router.use((req, res, next) => {
  if (req.method === "OPTIONS") return next();
  return res.status(404).json({
    error: "Not Found",
    path: req.originalUrl,
  });
});

/**
 * Manejador de errores del router
 */
// eslint-disable-next-line no-unused-vars
router.use((err, _req, res, _next) => {
  console.error("ROUTER ERROR:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

export default router;
