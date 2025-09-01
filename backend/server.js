// backend/server.js
import app from "./src/app.js";
import dotenv from "dotenv";
dotenv.config(); // ← Esto carga las variables de .env antes de todo

import userRoutes from "./src/routes/user.routes.js";
app.use("/api/auth", userRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});