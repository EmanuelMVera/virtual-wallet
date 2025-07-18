import { Router } from "express";
import { accountData, findAccount } from "../controllers/accountController.js";

const router = Router();

/**
 * @route GET /accounts/account
 * @desc Obtiene los datos de la cuenta del usuario autenticado
 */
router.get("/account", accountData);

/**
 * @route GET /accounts/find
 * @desc Busca una cuenta por alias o CBU
 */
router.get("/find", findAccount);

export default router;
