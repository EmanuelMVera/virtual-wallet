import { Request, Response } from "express";
import * as bankAccountService from "../services/bankAccountService.js";

export const registerBankAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await bankAccountService.registerBankAccount(
      req.body,
      userId
    );
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

export const depositToWallet = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await bankAccountService.depositToWallet(req.body, userId);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

export const listBankAccounts = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await bankAccountService.getUserBankAccounts(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
};
