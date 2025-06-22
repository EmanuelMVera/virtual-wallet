import dotenv from "dotenv";
import app from "./app.js";
import initDatabase from "./db/db.js";

// Cargar variables de entorno
dotenv.config();

const PORT = parseInt(process.env.PORT ?? "3000", 10);
const HOST = process.env.HOST || "localhost";

// Iniciar servidor
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://${HOST}:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al iniciar el servidor:", err);
    process.exit(1);
  });
