// backend/server.js
import app from "./src/app.js";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});