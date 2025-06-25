import { Router } from "express";
import {
  balance,
  listAccounts,
  createAccount,
  findAccount,
} from "../controllers/accountController.js";

const router = Router();

// Ruta para obtener el balance de la cuenta
router.get("/balance", balance);

// Ruta para listar cuentas
router.get("/list", listAccounts);

// Ruta para crear cuenta (por si no la tienes expuesta)
router.post("/create", createAccount);

// Ruta para buscar cuenta por alias o cbu
router.get("/find", findAccount);

export default router;
