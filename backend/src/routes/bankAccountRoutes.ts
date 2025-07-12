import { Router } from "express";
import {
  registerBankAccount,
  depositToWallet,
  listBankAccounts,
} from "../controllers/bankAccountController.js";
import {
  bankAccountValidation,
  depositValidation,
} from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @route POST /bank-accounts/register
 * @desc Registra una nueva cuenta bancaria para el usuario
 */
router.post("/register", protect, bankAccountValidation, registerBankAccount);

/**
 * @route POST /bank-accounts/deposit
 * @desc Realiza un depósito desde una cuenta bancaria a la billetera virtual
 */
router.post("/deposit", protect, depositValidation, depositToWallet);

/**
 * @route GET /bank-accounts/list
 * @desc Lista todas las cuentas bancarias asociadas al usuario
 */
router.get("/list", protect, listBankAccounts);

export default router;
