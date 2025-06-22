import { Router } from "express";
import userRoutes from "./userRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import accountRoutes from "./accountRoutes.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// Rutas públicas, irían antes del middleware protect
router.use("/users", userRoutes);

// Rutas protegidas (aplica protect solo aquí)
router.use("/accounts", protect, accountRoutes);
router.use("/transactions", protect, transactionRoutes);

export default router;
