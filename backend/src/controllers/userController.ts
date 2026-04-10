import { Request, Response } from "express";
import * as userService from "../services/userService.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await userService.registerUser(req.body);
    sendSuccess(res, result, undefined, 201);
  } catch (error: any) {
    sendError(res, error.status || 500, error.message || "Error durante el registro.");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await userService.loginUser(req.body);
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.status || 500, error.message || "Error durante el login.");
  }
};

export const logout = async (req: Request, res: Response) => {
  sendSuccess(res, null, "Sesión cerrada correctamente.");
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id; // Ahora usamos id
    if (!id) return sendError(res, 401, "Unauthorized");
    const result = await userService.getMe(id);
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.status || 500, error.message || "Error retrieving user");
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;
    if (!id) return sendError(res, 401, "Unauthorized");
    const result = await userService.updateProfile(id, req.body);
    sendSuccess(res, result);
  } catch (err: any) {
    sendError(res, err.status || 500, err.message || "Error updating profile");
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;
    if (!id) return sendError(res, 401, "Unauthorized");
    const result = await userService.updatePassword(id, req.body.password);
    sendSuccess(res, result);
  } catch (err: any) {
    sendError(res, err.status || 500, err.message || "Error updating password");
  }
};