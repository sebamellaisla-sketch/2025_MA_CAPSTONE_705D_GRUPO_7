import "dotenv/config";
import app from "./src/app.js"; // <-- antes decía "./app.js"

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
