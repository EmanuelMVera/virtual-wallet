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
