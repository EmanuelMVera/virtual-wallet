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
import { validate } from "../utils/validationUtils.js";

const router = Router();

router.post("/register", bankAccountValidation, validate, registerBankAccount);
router.post("/deposit", depositValidation, validate, depositToWallet);
router.get("/list", listBankAccounts);

export default router;
