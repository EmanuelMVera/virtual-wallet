import { Request, Response } from "express";
import { models } from "../db/db.js";
import { Op } from "sequelize";

/**
 * Crea una nueva transacción (transferencia) entre cuentas virtuales.
 */
export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sequelize = models.Account.sequelize;
  const t = await sequelize.transaction();
  try {
    const { senderAccountId, receiverAccountId, amount } = req.body;
    const userId = req.user?.id;

    // Verifica que el usuario sea dueño de la cuenta de origen
    const senderAccount = await models.Account.findOne({
      where: { id: senderAccountId, userId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!senderAccount) {
      await t.rollback();
      res.status(403).json({ message: "Not authorized for this account." });
      return;
    }

    // Busca la cuenta destino por id, alias o cbu
    let receiverAccount;
    if (receiverAccountId) {
      receiverAccount = await models.Account.findOne({
        where: { id: receiverAccountId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    } else if (req.body.receiverAlias) {
      receiverAccount = await models.Account.findOne({
        where: { alias: req.body.receiverAlias },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    } else if (req.body.receiverCbu) {
      receiverAccount = await models.Account.findOne({
        where: { cbu: req.body.receiverCbu },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }
    if (!receiverAccount) {
      await t.rollback();
      res.status(404).json({ message: "Receiver account not found." });
      return;
    }

    // Verifica saldo suficiente
    if (Number(senderAccount.balance) < Number(amount)) {
      await t.rollback();
      res.status(400).json({ message: "Insufficient balance." });
      return;
    }

    // Realiza la transferencia
    senderAccount.balance = (
      Number(senderAccount.balance) - Number(amount)
    ).toFixed(2);
    receiverAccount.balance = (
      Number(receiverAccount.balance) + Number(amount)
    ).toFixed(2);
    await senderAccount.save({ transaction: t });
    await receiverAccount.save({ transaction: t });

    // Crea la transacción
    const transaction = await models.Transaction.create(
      {
        senderAccountId,
        receiverAccountId,
        amount,
        type: "transfer",
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      message: "Transaction completed successfully.",
      transaction,
      senderAccount: {
        id: senderAccount.id,
        balance: senderAccount.balance,
      },
      receiverAccount: {
        id: receiverAccount.id,
        balance: receiverAccount.balance,
      },
    });
  } catch (error: any) {
    if (t) await t.rollback();
    res.status(500).json({
      message: "Server error while creating transaction.",
      error: error.message,
    });
  }
};

/**
 * Lista todas las transacciones donde el usuario autenticado es emisor o receptor.
 */
export const listUserTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }

    // Busca todas las cuentas del usuario
    const accounts = await models.Account.findAll({ where: { userId } });
    const accountIds = accounts.map((acc: any) => acc.id);

    // Busca transacciones donde el usuario sea emisor o receptor
    const transactions = await models.Transaction.findAll({
      where: {
        [Op.or]: [
          { senderAccountId: accountIds },
          { receiverAccountId: accountIds },
          // Incluye depósitos desde banco (senderAccountId null y receiverAccountId del usuario)
          { senderAccountId: null, receiverAccountId: accountIds },
        ],
      },
      order: [["timestamp", "DESC"]],
    });

    res.status(200).json({ transactions });
  } catch (error: any) {
    res.status(500).json({
      message: "Server error while listing transactions.",
      error: error.message,
    });
  }
};
