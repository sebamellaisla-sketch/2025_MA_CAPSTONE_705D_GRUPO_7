// backend/src/routes/quote.routes.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createQuote } from "../controllers/quote.controller.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Destino: backend/uploads/quotes (desde src/routes → .. → .. → uploads/quotes)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dest = path.join(__dirname, "..", "..", "uploads", "quotes");
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = path.basename(file.originalname || "adjunto", ext);
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  if (/^image\//.test(file.mimetype)) cb(null, true);
  else cb(new Error("Solo se permiten imágenes (jpg, png, webp, etc.)"));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ⚠️ Campo del archivo DEBE llamarse "attachment"
router.post("/", upload.single("attachment"), createQuote);

// Ruta de depuración para verificar multer (la usaremos en el Paso 3)
router.post("/_debug", upload.single("attachment"), (req, res) => {
  res.json({
    hasFile: !!req.file,
    file: req.file ? {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : null,
    bodyKeys: Object.keys(req.body)
  });
});

export default router;
