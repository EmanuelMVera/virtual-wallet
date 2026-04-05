import { Request, Response } from "express";
import * as walletService from "../services/walletService.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";

export const deposit = async (req: Request, res: Response) => {
  try {
    const dni = req.user!.dni;
    const { amount } = req.body;
    const result = await walletService.deposit(dni, Number(amount));
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.status || 500, error.message);
  }
};

export const withdraw = async (req: Request, res: Response) => {
  try {
    const dni = req.user!.dni;
    const { amount } = req.body;
    const result = await walletService.withdraw(dni, Number(amount));
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.status || 500, error.message);
  }
};

export const transfer = async (req: Request, res: Response) => {
  try {
    const dni = req.user!.dni;
    const { targetAlias, amount } = req.body;
    const result = await walletService.transfer(dni, targetAlias, Number(amount));
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.status || 500, error.message);
  }
};

export const history = async (req: Request, res: Response) => {
  try {
    const dni = req.user!.dni;
    const result = await walletService.history(dni);
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.status || 500, error.message);
  }
};

