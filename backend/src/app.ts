import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/index.js";

const app: Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging solo en desarrollo
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rutas principales
app.use("/api", router);

// Ruta no encontrada
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
    method: req.method,
  });
});

// Manejo global de errores
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Error no manejado:", err.stack);

  res.status(500).json({
    error: "Error interno del servidor",
    message: err.message,
  });
});

export default app;
