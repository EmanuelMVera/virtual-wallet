import { models } from "../db/db.js";
import { RequestHandler } from "express";
import { sendError } from "../utils/responseUtils.js";

export const accountData: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;

    const account = await models.Account.findOne({ where: { userId } });
    if (!account) {
      sendError(res, 404, "Cuenta no encontrada para este usuario.");
      return;
    }

    res.status(200).json({
      message: "Datos de la cuenta obtenidos correctamente.",
      account: {
        id: account.id,
        alias: account.alias,
        cbu: account.cbu,
        balance: account.balance,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error del servidor al obtener los datos de la cuenta.",
      error: error.message,
    });
  }
};

export const findAccount: RequestHandler = async (req, res) => {
  try {
    const alias =
      typeof req.query.alias === "string" ? req.query.alias : undefined;
    const cbu = typeof req.query.cbu === "string" ? req.query.cbu : undefined;

    if (!alias && !cbu) {
      sendError(
        res,
        400,
        "Proporcione alias o cbu como parámetro de consulta."
      );
      return;
    }

    const account = await models.Account.findOne({
      where: alias ? { alias } : { cbu },
    });

    if (!account) {
      sendError(res, 404, "Cuenta no encontrada.");
      return;
    }

    res.status(200).json({
      message: "Datos de la cuenta obtenidos correctamente.",
      account: { id: account.id, alias: account.alias, cbu: account.cbu },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error del servidor al buscar la cuenta.",
      error: error.message,
    });
  }
};
