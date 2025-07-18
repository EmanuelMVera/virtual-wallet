import { Router } from "express";
import {
  createTransaction,
  listUserTransactions,
} from "../controllers/transactionController.js";
import { transactionValidation } from "../middlewares/validationMiddleware.js";

const router = Router();

/**
 * @route POST /transactions/transfer
 * @desc Crea una nueva transacción (transferencia)
 */
router.post("/transfer", transactionValidation, createTransaction);

/**
 * @route GET /transactions/list
 * @desc Lista todas las transacciones del usuario autenticado
 */
router.get("/list", listUserTransactions);

export default router;
