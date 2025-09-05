import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
// NECESARIO: Webpay te enviará un POST con token_ws a /api/webpay/commit
app.use(express.urlencoded({ extended: true }));

// Monta todas las rutas bajo /api
app.use("/api", routes);

// Healthcheck
app.get("/health", (_, res) => res.send("ok"));

export default app;
