import { Router } from "express";
import { createTransaction, confirmTransaction, getTransactionStatus } from "../controllers/webpay.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/create", verifyToken, createTransaction);
router.post("/confirm", confirmTransaction);
router.get("/status/:token", verifyToken, getTransactionStatus);

export default router;