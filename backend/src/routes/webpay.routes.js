// backend/src/routes/webpay.routes.js
import { Router } from "express";
import {
  createTransaction,
  commitTransaction,
} from "../controllers/webpay.controller.js";

const router = Router();

// Crear transacción
router.post("/create", createTransaction);

// Commit: acepta POST (flujo normal) y GET (refresh/volver)
router.post("/commit", commitTransaction);
router.get("/commit", commitTransaction);

export default router;
