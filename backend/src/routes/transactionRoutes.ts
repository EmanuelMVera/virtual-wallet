import { Router } from "express";
import {
  createTransaction,
  getUserBankAccounts,
} from "../controllers/transactionController.js";
import { transactionValidation } from "../middlewares/validationMiddleware.js";
import { validate } from "../utils/validationUtils.js";

const router = Router();

router.post("/transfer", transactionValidation, validate, createTransaction);
router.get("/list", getUserBankAccounts);

export default router;
