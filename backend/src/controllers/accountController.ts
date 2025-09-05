import { Request, Response } from "express";
import * as accountService from "../services/accountService.js";

export const getUserAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await accountService.getUserAccountData(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const findAccountByAliasOrCbu = async (req: Request, res: Response) => {
  try {
    const alias =
      typeof req.query.alias === "string" ? req.query.alias : undefined;
    const cbu = typeof req.query.cbu === "string" ? req.query.cbu : undefined;
    const result = await accountService.findAccount(alias, cbu);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
