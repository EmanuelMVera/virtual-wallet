import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/userController";
import {
  registerValidation,
  loginValidation,
} from "../middlewares/validationMiddleware";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", logout);
// Endpoint protegido para obtener información del usuario autenticado
router.get("/me", protect, getMe);

export default router;
