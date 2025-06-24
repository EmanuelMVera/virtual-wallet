import { Router } from "express";
import {
  registerBankAccount,
  depositToWallet,
} from "../controllers/bankAccountController.js";

const router = Router();

router.post("/register", registerBankAccount);
router.post("/deposit", depositToWallet);

export default router;
