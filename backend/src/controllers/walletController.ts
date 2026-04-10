import { Request, Response } from "express";
import * as walletService from "../services/walletService.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";

export const deposit = async (req: Request, res: Response) => {
  try {
    const id = req.user!.id;
    const { amount } = req.body;
    const result = await walletService.deposit(id, Number(amount));
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.status || 500, error.message);
  }
};

export const withdraw = async (req: Request, res: Response) => {
  try {
    const id = req.user!.id;
    const { amount } = req.body;
    const result = await walletService.withdraw(id, Number(amount));
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.status || 500, error.message);
  }
};

export const transfer = async (req: Request, res: Response) => {
  try {
    const id = req.user!.id;
    const { targetAlias, amount } = req.body;
    const result = await walletService.transfer(id, targetAlias, Number(amount));
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.status || 500, error.message);
  }
};

export const history = async (req: Request, res: Response) => {
  try {
    const id = req.user!.id;
    const result = await walletService.history(id);
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.status || 500, error.message);
  }
};