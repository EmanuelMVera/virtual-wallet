import { Router } from "express";
import { register, login, logout } from "../controllers/userController";
import {
  registerValidation,
  loginValidation,
} from "../middlewares/validationMiddleware";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", logout);

export default router;
