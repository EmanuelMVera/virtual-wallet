import { Router } from "express";
import { balance, listAccounts } from "../controllers/accountController.js";

const router = Router();

// Ruta para obtener el balance de la cuenta
router.get("/balance", balance);

// Ruta para listar cuentas
router.get("/list", listAccounts);

export default router;
