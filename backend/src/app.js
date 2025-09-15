// backend/src/app.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

// ---- Para adjuntar imágenes en cotizaciones (servir /uploads) ----
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1) Instanciar app primero
const app = express();

// 2) CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 3) Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Webpay token_ws y forms

// 4) Servir archivos subidos (p.ej. http://localhost:3000/uploads/quotes/archivo.jpg)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// 5) Rutas API
app.use("/api", routes);

// 6) Healthcheck
app.get("/health", (_req, res) => res.send("ok"));

export default app;
