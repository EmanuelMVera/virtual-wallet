import { models } from "../db/db.js";
import { Request, Response } from "express";
import * as transactionService from "../services/transactionService.js";

export const createTransaction = async (req: Request, res: Response) => {
  const sequelize = models.Account.sequelize!;
  const t = await sequelize.transaction();

  try {
    const userId = req.user!.id;
    const result = await transactionService.transferFunds(req.body, userId);
    res.status(201).json(result);
  } catch (error: any) {
    await t.rollback();
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

export const getUserBankAccounts = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await transactionService.listUserTransactions(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
};
