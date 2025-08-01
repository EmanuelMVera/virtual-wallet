import { models } from "../db/db.js";
import { formatBalance } from "../utils/formatUtils.js";

export const registerBankAccount = async (
  { bankName, accountNumber }: any,
  userId: number
) => {
  const bankAccount = await models.BankAccount.create({
    userId,
    bankName,
    accountNumber,
    balance: 1000.0,
  });

  return {
    message: "Cuenta bancaria registrada correctamente.",
    bankAccount,
  };
};

export const depositToWallet = async (
  { bankAccountId, walletAccountId, amount }: any,
  userId: number
) => {
  const bankAccount = await models.BankAccount.findOne({
    where: { id: bankAccountId, userId },
  });
  if (!bankAccount) {
    const error: any = new Error("Cuenta bancaria no encontrada.");
    error.status = 404;
    throw error;
  }

  const walletAccount = await models.Account.findOne({
    where: { id: walletAccountId, userId },
  });
  if (!walletAccount) {
    const error: any = new Error("Cuenta virtual no encontrada.");
    error.status = 404;
    throw error;
  }

  const bankBalance = parseFloat(bankAccount.get("balance")?.toString() ?? "0");
  const walletBalance = parseFloat(
    walletAccount.get("balance")?.toString() ?? "0"
  );
  const depositAmount =
    typeof amount === "string" ? parseFloat(amount) : Number(amount);

  if (isNaN(depositAmount) || depositAmount <= 0) {
    const error: any = new Error("Monto de depósito inválido.");
    error.status = 400;
    throw error;
  }
  if (bankBalance < depositAmount) {
    const error: any = new Error("Saldo insuficiente en la cuenta bancaria.");
    error.status = 400;
    throw error;
  }

  bankAccount.set("balance", formatBalance(bankBalance - depositAmount));
  walletAccount.set("balance", formatBalance(walletBalance + depositAmount));

  await bankAccount.save();
  await walletAccount.save();

  await models.Transaction.create({
    senderAccountId: null,
    receiverAccountId: walletAccount.id,
    amount: depositAmount,
    type: "deposit",
  });

  return {
    message: "Depósito realizado correctamente.",
    bankAccount: { id: bankAccount.id, balance: bankAccount.get("balance") },
    walletAccount: {
      id: walletAccount.id,
      balance: walletAccount.get("balance"),
    },
  };
};

export const getUserBankAccounts = async (userId: number) => {
  const bankAccounts = await models.BankAccount.findAll({
    where: { userId },
    attributes: [
      "id",
      "bankName",
      "accountNumber",
      "balance",
      "createdAt",
      "updatedAt",
    ],
  });

  return {
    bankAccounts,
  };
};
