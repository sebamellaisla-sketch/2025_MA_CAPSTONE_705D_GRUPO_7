import { Router } from "express";
import userRoutes from "./user.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import quoteRoutes from "./quote.routes.js";

const router = Router();

router.use("/auth", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/quotes", quoteRoutes);

export default router;