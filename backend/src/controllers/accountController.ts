import { CustomJwtPayload } from "../../custom.js";
import { models } from "../db/db.js";
import { Request, Response } from "express";

// Extiende la interfaz Request para incluir 'user'
declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

/**
 * Obtiene el balance de la cuenta del usuario autenticado.
 */
export const balance = async (req: Request, res: Response) => {
  try {
    const Account = models.Account;
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Usuario no autenticado." });
      return;
    }
    const userId = req.user.id;
    const account = await Account.findOne({ where: { userId } });

    if (!account) {
      res.status(404).json({ message: "Cuenta no encontrada." });
      return;
    }

    res.status(200).json({
      message: "Balance de la cuenta obtenido correctamente.",
      balance: account.balance,
    });
  } catch (error: any) {
    console.error("Error al obtener el balance de la cuenta:", error);
    res.status(500).json({
      message: "Error del servidor al obtener el balance de la cuenta.",
      error: error.message,
    });
  }
};

/**
 * Crea una nueva cuenta virtual para el usuario autenticado.
 */
export const createAccount = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Usuario no autenticado." });
      return;
    }
    const Account = models.Account;

    // Genera alias y cbu únicos
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
      message: "Cuenta creada correctamente.",
      account: newAccount,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error del servidor al crear la cuenta.",
      error: error.message,
    });
  }
};

/**
 * Lista todas las cuentas virtuales del usuario autenticado.
 */
export const listAccounts = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Usuario no autenticado." });
      return;
    }
    const Account = models.Account;
    const accounts = await Account.findAll({ where: { userId: req.user.id } });
    res.status(200).json({ accounts });
  } catch (error: any) {
    res.status(500).json({
      message: "Error del servidor al listar las cuentas.",
      error: error.message,
    });
  }
};

/**
 * Busca una cuenta por alias o CBU.
 */
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
      res
        .status(400)
        .json({
          message: "Proporcione alias o cbu como parámetro de consulta.",
        });
      return;
    }
    if (!account) {
      res.status(404).json({ message: "Cuenta no encontrada." });
      return;
    }
    // Solo devuelve datos públicos
    res.status(200).json({
      account: {
        id: account.id,
        alias: account.alias,
        cbu: account.cbu,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error del servidor al buscar la cuenta.",
      error: error.message,
    });
  }
};
