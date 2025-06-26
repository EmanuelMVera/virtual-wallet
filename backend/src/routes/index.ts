import { Router } from "express";
import userRoutes from "./userRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import accountRoutes from "./accountRoutes.js";
import bankAccountRoutes from "./bankAccountRoutes.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * Rutas públicas (no requieren autenticación)
 */
router.use("/users", userRoutes);

/**
 * Rutas protegidas (requieren autenticación con JWT)
 */
router.use("/accounts", protect, accountRoutes);
router.use("/transactions", protect, transactionRoutes);
router.use("/bank-accounts", protect, bankAccountRoutes);

export default router;
