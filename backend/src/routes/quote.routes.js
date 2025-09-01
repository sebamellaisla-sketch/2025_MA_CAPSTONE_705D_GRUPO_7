import { Router } from "express";
import { createQuote } from "../controllers/quote.controller.js";

const router = Router();

// POST /api/quotes → crear nueva cotización
router.post("/", createQuote);

export default router;