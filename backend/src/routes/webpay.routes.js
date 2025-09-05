import { Router } from "express";
import {
  createTransaction,
  commitTransaction,
} from "../controllers/webpay.controller.js";

const router = Router();

// /api/webpay/create
router.post("/create", createTransaction);

// /api/webpay/commit (return_url)
router.post("/commit", commitTransaction);

export default router;
