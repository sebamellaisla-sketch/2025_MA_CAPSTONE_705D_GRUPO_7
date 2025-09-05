// backend/server.js
import "dotenv/config";
import app from "./src/app.js";
import { ensureOrdersTable } from "./src/models/order.model.js";

try {
  await ensureOrdersTable();
  console.log("✔️ Tabla 'orders' verificada/actualizada");
} catch (e) {
  console.error("❌ Error preparando tabla 'orders':", e);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
