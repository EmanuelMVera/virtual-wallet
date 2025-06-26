import { Router } from "express";
import {
  registerBankAccount,
  depositToWallet,
  listBankAccounts,
} from "../controllers/bankAccountController.js";

const router = Router();

/**
 * @route POST /bank-accounts/register
 * @desc Registra una nueva cuenta bancaria para el usuario
 */
router.post("/register", registerBankAccount);

/**
 * @route POST /bank-accounts/deposit
 * @desc Realiza un depósito desde una cuenta bancaria a la billetera virtual
 */
router.post("/deposit", depositToWallet);

/**
 * @route GET /bank-accounts/list
 * @desc Lista todas las cuentas bancarias asociadas al usuario
 */
router.get("/list", listBankAccounts);

export default router;
