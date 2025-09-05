import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Webpay token_ws y forms;

app.use("/api", routes);
app.get("/health", (_, res) => res.send("ok"));

export default app;
