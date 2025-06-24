import { Router } from "express";
import { register, login } from "../controllers/userController.js";

const router = Router();

// Ruta para registrar un nuevo usuario
router.post("/register", register);

// Ruta para iniciar sesión y obtener un token JWT
router.post("/login", login);

export default router;
