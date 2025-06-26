import { Router } from "express";
import { register, login, logout } from "../controllers/userController.js";

const router = Router();

/**
 * @route POST /users/register
 * @desc Registra un nuevo usuario
 */
router.post("/register", register);

/**
 * @route POST /users/login
 * @desc Inicia sesión y obtiene un token JWT
 */
router.post("/login", login);

/**
 * @route POST /users/logout
 * @desc Cierra la sesión del usuario
 */
router.post("/logout", logout);

export default router;
