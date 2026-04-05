import { Router } from "express";
import {
  deposit,
  withdraw,
  transfer,
  history,
} from "../controllers/walletController.js";

const router = Router();

router.post("/deposit", deposit);
router.post("/withdraw", withdraw);
router.post("/transfer", transfer);
router.get("/history", history);

export default router;
