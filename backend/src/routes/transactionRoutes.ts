import { Router } from "express";
import {
  createTransaction,
  listUserTransactions,
} from "../controllers/transactionController.js";
import { transactionValidation } from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @route POST /transactions/transfer
 * @desc Crea una nueva transacción (transferencia)
 */
router.post("/transfer", protect, transactionValidation, createTransaction);

/**
 * @route GET /transactions/list
 * @desc Lista todas las transacciones del usuario autenticado
 */
router.get("/list", protect, listUserTransactions);

export default router;
