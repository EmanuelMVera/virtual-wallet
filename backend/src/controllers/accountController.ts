import { CustomJwtPayload } from "../../custom.js";
import { models } from "../db/db.js";
import { Request, Response } from "express";

// Extiende la interfaz Request para incluir 'user'
declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload; // Debe coincidir con la declaración global
    }
  }
}

export const balance = async (req: Request, res: Response) => {
  try {
    // Obtén el modelo Account dinámicamente
    const Account = models.Account;

    // 1. Obtener el balance de la cuenta del usuario autenticado
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }
    const userId = req.user.id; // Asumiendo que el ID del usuario está en req.user.id
    const account = await Account.findOne({ where: { userId } });

    if (!account) {
      res.status(404).json({ message: "Account not found." });
      return;
    }

    res.status(200).json({
      message: "Account balance retrieved successfully.",
      balance: account.balance, // <-- asegúrate de incluir el balance aquí
    });
  } catch (error: any) {
    console.error("Error retrieving account balance:", error);
    res.status(500).json({
      message: "Server error while retrieving account balance.",
      error: error.message,
    });
  }
};

export const createAccount = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }
    const Account = models.Account;

    // Generar alias y cbu únicos
    let alias: string, cbu: string;
    let isUnique = false;
    do {
      alias = `alias${Math.random().toString(36).substring(2, 10)}`;
      cbu = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
      const exists = await Account.findOne({
        where: { [models.Sequelize.Op.or]: [{ alias }, { cbu }] },
      });
      isUnique = !exists;
    } while (!isUnique);

    const newAccount = await Account.create({
      userId: req.user.id,
      balance: 0.0,
      alias,
      cbu,
    });
    res.status(201).json({
      message: "Account created successfully.",
      account: newAccount,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Server error while creating account.",
      error: error.message,
    });
  }
};

export const listAccounts = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }
    const Account = models.Account;
    const accounts = await Account.findAll({ where: { userId: req.user.id } });
    res.status(200).json({ accounts });
  } catch (error: any) {
    res.status(500).json({
      message: "Server error while listing accounts.",
      error: error.message,
    });
  }
};

export const findAccount = async (req: Request, res: Response) => {
  try {
    const { alias, cbu } = req.query;
    const Account = models.Account;
    let account;
    if (alias) {
      account = await Account.findOne({ where: { alias } });
    } else if (cbu) {
      account = await Account.findOne({ where: { cbu } });
    } else {
      res.status(400).json({ message: "Provide alias or cbu as query param." });
      return;
    }
    if (!account) {
      res.status(404).json({ message: "Account not found." });
      return;
    }
    res.status(200).json({ account });
  } catch (error: any) {
    res.status(500).json({
      message: "Server error while finding account.",
      error: error.message,
    });
  }
};
