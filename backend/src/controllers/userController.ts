import { Request, Response } from "express";
import * as userService from "../services/userService.js";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await userService.loginUser(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Sesión cerrada correctamente." });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // Suponiendo que el usuario autenticado está en req.user (middleware de autenticación)
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }
    // Asegurarse de que userId es un número
    const user = await userService.getMe(Number(userId));
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};
