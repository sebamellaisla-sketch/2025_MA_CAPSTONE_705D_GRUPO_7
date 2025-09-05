// backend/src/routes/index.js
import { Router } from "express";
import userRoutes from "./user.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import quoteRoutes from "./quote.routes.js";
// import orderRoutes from "./order.routes.js";

const router = Router();

router.use("/auth", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/quotes", quoteRoutes);
// router.use("/orders", orderRoutes);

export default router;