import { Router } from "express";
import { register, login, logout } from "../controllers/userController.js";

const router = Router();

// Ruta para registrar un nuevo usuario
router.post("/register", register);

// Ruta para iniciar sesión y obtener un token JWT
router.post("/login", login);

// Ruta para cerrar sesión
router.post("/logout", logout);

export default router;
