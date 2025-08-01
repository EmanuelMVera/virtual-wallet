import { models } from "../db/db.js";
import { formatBalance } from "../utils/formatUtils.js";
import { Op } from "sequelize";

export const transferFunds = async (
  {
    senderAccountId,
    receiverAccountId,
    receiverAlias,
    receiverCbu,
    amount,
  }: any,
  userId: number
) => {
  const sequelize = models.Account.sequelize!;
  const t = await sequelize.transaction();

  // Validar cuenta emisora pertenece al usuario
  const senderAccount = await models.Account.findOne({
    where: { id: senderAccountId, userId },
    transaction: t,
    lock: t.LOCK.UPDATE,
  });
  if (!senderAccount) {
    await t.rollback();
    const error: any = new Error("No autorizado para esta cuenta.");
    error.status = 403;
    throw error;
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
    const error: any = new Error("Cuenta de destino no encontrada.");
    error.status = 404;
    throw error;
  }

  // Nueva validación: evitar transferencias a la misma cuenta
  if (senderAccountId === receiverAccountId) {
    await t.rollback();
    const error: any = new Error("No se puede transferir a la misma cuenta.");
    error.status = 400;
    throw error;
  }

  // Validar saldo suficiente
  if (Number(senderAccount.balance) < Number(amount)) {
    await t.rollback();
    const error: any = new Error("Saldo insuficiente.");
    error.status = 400;
    throw error;
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

  return {
    message: "Transacción realizada correctamente.",
    transaction,
    senderAccount: { id: senderAccount.id, balance: senderAccount.balance },
    receiverAccount: {
      id: receiverAccount.id,
      balance: receiverAccount.balance,
    },
  };
};

export const listUserTransactions = async (userId: number) => {
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

  return {
    transactions,
  };
};
