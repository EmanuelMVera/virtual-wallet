import { Router } from "express";
import {
  getUserAccount,
  findAccountByAliasOrCbu,
} from "../controllers/accountController.js";

const router = Router();

router.get("/account", getUserAccount);
router.get("/find", findAccountByAliasOrCbu);

export default router;
