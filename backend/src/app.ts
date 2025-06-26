import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/index.js";

const app: Application = express();

// ========================
// Middlewares globales
// ========================

// Habilita CORS para permitir solicitudes de diferentes orígenes
app.use(cors());

// Permite recibir y parsear JSON en las solicitudes
app.use(express.json());

// Permite recibir datos codificados en la URL (formularios)
app.use(express.urlencoded({ extended: true }));

// Logging de peticiones HTTP solo en entorno de desarrollo
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ========================
// Rutas principales
// ========================

// Prefijo '/api' para todas las rutas de la aplicación
app.use("/api", router);

// ========================
// Manejo de rutas no encontradas (404)
// ========================

app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
    method: req.method,
  });
});

// ========================
// Manejo global de errores
// ========================

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  // Imprime el error en consola para depuración
  console.error("❌ Error no manejado:", err.stack);

  res.status(500).json({
    error: "Error interno del servidor",
    message: err.message,
  });
});

export default app;
