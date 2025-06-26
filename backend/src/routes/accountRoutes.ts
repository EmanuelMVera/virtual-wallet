import { Router } from "express";
import {
  balance,
  listAccounts,
  createAccount,
  findAccount,
} from "../controllers/accountController.js";

const router = Router();

/**
 * @route GET /accounts/balance
 * @desc Obtiene el balance de la cuenta del usuario autenticado
 */
router.get("/balance", balance);

/**
 * @route GET /accounts/list
 * @desc Lista todas las cuentas del usuario autenticado
 */
router.get("/list", listAccounts);

/**
 * @route POST /accounts/create
 * @desc Crea una nueva cuenta para el usuario
 */
router.post("/create", createAccount);

/**
 * @route GET /accounts/find
 * @desc Busca una cuenta por alias o CBU
 */
router.get("/find", findAccount);

export default router;
