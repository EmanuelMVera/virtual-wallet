import { RequestHandler } from "express";
import { models } from "../db/db.js";
import { validationResult } from "express-validator";
import { sendError } from "../utils/responseUtils.js";
import { formatBalance } from "../utils/formatUtils.js";
import { Op } from "sequelize";

export const createTransaction: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const sequelize = models.Account.sequelize!;
  const t = await sequelize.transaction();

  try {
    const {
      senderAccountId,
      receiverAccountId,
      receiverAlias,
      receiverCbu,
      amount,
    } = req.body;
    const userId = req.user!.id;

    // Validar cuenta emisora pertenece al usuario
    const senderAccount = await models.Account.findOne({
      where: { id: senderAccountId, userId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!senderAccount) {
      await t.rollback();
      sendError(res, 403, "No autorizado para esta cuenta.");
      return;
    }

    // Obtener cuenta receptora por ID, alias o CBU
    let receiverAccount = null;
    if (receiverAccountId) {
      receiverAccount = await models.Account.findOne({
        where: { id: receiverAccountId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    } else if (receiverAlias) {
      receiverAccount = await models.Account.findOne({
        where: { alias: receiverAlias },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    } else if (receiverCbu) {
      receiverAccount = await models.Account.findOne({
        where: { cbu: receiverCbu },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }

    // Validar existencia de la cuenta receptora
    if (!receiverAccount) {
      await t.rollback();
      sendError(res, 404, "Cuenta de destino no encontrada.");
      return;
    }

    // Nueva validación: evitar transferencias a la misma cuenta
    if (senderAccountId === receiverAccountId) {
      await t.rollback();
      res
        .status(400)
        .json({ message: "No se puede transferir a la misma cuenta." });
      return;
    }

    // Validar saldo suficiente
    if (Number(senderAccount.balance) < Number(amount)) {
      await t.rollback();
      sendError(res, 400, "Saldo insuficiente.");
      return;
    }

    // Actualizar balances
    senderAccount.balance = formatBalance(
      Number(senderAccount.balance) - Number(amount)
    );
    receiverAccount.balance = formatBalance(
      Number(receiverAccount.balance) + Number(amount)
    );

    await senderAccount.save({ transaction: t });
    await receiverAccount.save({ transaction: t });

    // Registrar transacción
    const transaction = await models.Transaction.create(
      {
        senderAccountId,
        receiverAccountId: receiverAccount.id,
        amount,
        type: "transfer",
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      message: "Transacción realizada correctamente.",
      transaction,
      senderAccount: { id: senderAccount.id, balance: senderAccount.balance },
      receiverAccount: {
        id: receiverAccount.id,
        balance: receiverAccount.balance,
      },
    });
  } catch (error: any) {
    await t.rollback();
    res.status(500).json({
      message: "Error del servidor al crear la transacción.",
      error: error.message,
    });
  }
};

export const listUserTransactions: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;

    const accounts = await models.Account.findAll({ where: { userId } });
    const accountIds = accounts.map((acc: { id: number }) => acc.id);

    const transactions = await models.Transaction.findAll({
      where: {
        [Op.or]: [
          { senderAccountId: accountIds },
          { receiverAccountId: accountIds },
          { senderAccountId: null, receiverAccountId: accountIds },
        ],
      },
      order: [["timestamp", "DESC"]],
    });

    res.status(200).json({ transactions });
  } catch (error: any) {
    res.status(500).json({
      message: "Error del servidor al listar las transacciones.",
      error: error.message,
    });
  }
};
