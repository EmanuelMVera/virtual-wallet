import { Request, Response } from "express";
import * as userService from "../services/userService.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await userService.registerUser(req.body);
    sendSuccess(res, result, undefined, 201);
  } catch (error: any) {
    if (error.status && error.status !== 500) {
      sendError(res, error.status, error.message);
    } else {
      sendError(res, 500, "Error del servidor durante el registro.");
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await userService.loginUser(req.body);
    sendSuccess(res, result);
  } catch (error: any) {
    if (error.status && error.status !== 500) {
      sendError(res, error.status, error.message);
    } else {
      sendError(res, 500, "Error del servidor durante el login.");
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  sendSuccess(res, null, "Sesión cerrada correctamente.");
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const dni = req.user?.dni;
    if (!dni) {
      return sendError(res, 401, "Unauthorized");
    }
    const result = await userService.getMe(dni);
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.status || 500, error.message || "Error retrieving user");
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const dni = req.user?.dni;
    if (!dni) return sendError(res, 401, "Unauthorized");

    const result = await userService.updateProfile(dni, req.body);
    sendSuccess(res, result);
  } catch (err: any) {
    sendError(res, err.status || 500, err.message || "Error updating profile");
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const dni = req.user?.dni;
    if (!dni) return sendError(res, 401, "Unauthorized");

    const { password } = req.body;
    const result = await userService.updatePassword(dni, password);
    sendSuccess(res, result);
  } catch (err: any) {
    sendError(res, err.status || 500, err.message || "Error updating password");
  }
};
