import { Router } from "express";
import userRoutes from "./userRoutes.js";
import accountRoutes from "./accountRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
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
console.log("[routes] montando /accounts");
router.use("/accounts", protect, accountRoutes);
console.log("[routes] /accounts montado");
router.use("/transactions", protect, transactionRoutes);
router.use("/bank-accounts", protect, bankAccountRoutes);

export default router;
