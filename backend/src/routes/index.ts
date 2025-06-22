import { Router } from "express";
import userRoutes from "./userRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import accountRoutes from "./accountRoutes.js";
import { protect } from "../middlewares/authMiddleware.js";
import authRoutes from "./authRoutes.js";

const router = Router();

// Rutas públicas (ej. auth) irían antes del middleware protect
router.use("/auth", authRoutes);

// Rutas protegidas (aplica protect solo aquí)
router.use("/users", protect, userRoutes);
router.use("/accounts", protect, accountRoutes);
router.use("/transactions", protect, transactionRoutes);

export default router;
