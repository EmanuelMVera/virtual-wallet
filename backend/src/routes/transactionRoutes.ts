import { Request, Response, Router } from "express";
import {
  createTransaction,
  listUserTransactions,
} from "../controllers/transactionController.js";

const router = Router();

// Ruta para crear una nueva transacción
router.post("/transfer", createTransaction);

// Ruta para listar transacciones del usuario autenticado
router.get("/list", listUserTransactions);

export default router;
