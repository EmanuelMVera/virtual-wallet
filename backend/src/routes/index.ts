import { Router } from "express";
import userRoutes from "./userRoutes.js";
// import { protect } from "../middlewares/authMiddleware.js";
// import authRoutes from "./authRoutes.js";

const router = Router();

// Rutas públicas (ej. auth) irían antes del middleware protect
// router.use("/auth", authRoutes);

// Middleware de protección global
// router.use(protect);

// Rutas protegidas
router.use("/users", userRoutes);

// router.get('/accounts', protect, accountRoutes); // Si tuvieras rutas para cuentas
// router.get('/transactions', protect, transactionRoutes); // Si tuvieras rutas para transacciones

export default router;
