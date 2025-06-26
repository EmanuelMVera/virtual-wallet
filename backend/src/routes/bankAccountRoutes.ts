import { Router } from "express";
import {
  registerBankAccount,
  depositToWallet,
  listBankAccounts, // <--- importa el nuevo controlador
} from "../controllers/bankAccountController.js";

const router = Router();

router.post("/register", registerBankAccount);
router.post("/deposit", depositToWallet);
router.get("/list", listBankAccounts); // <--- nueva ruta

export default router;
