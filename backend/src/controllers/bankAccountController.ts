import { RequestHandler } from "express";
import { models } from "../db/db.js";
import { validationResult } from "express-validator";
import { sendError } from "../utils/responseUtils.js";
import { formatBalance } from "../utils/formatUtils.js";

export const registerBankAccount: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { bankName, accountNumber } = req.body;
    const userId = req.user!.id;

    const bankAccount = await models.BankAccount.create({
      userId,
      bankName,
      accountNumber,
      balance: 1000.0,
    });

    res.status(201).json({
      message: "Cuenta bancaria registrada correctamente.",
      bankAccount,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error registrando la cuenta bancaria.",
      error: error.message,
    });
  }
};

export const depositToWallet: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { bankAccountId, walletAccountId, amount } = req.body;
    const userId = req.user!.id;

    const bankAccount = await models.BankAccount.findOne({
      where: { id: bankAccountId, userId },
    });
    if (!bankAccount) {
      sendError(res, 404, "Cuenta bancaria no encontrada.");
      return;
    }

    const walletAccount = await models.Account.findOne({
      where: { id: walletAccountId, userId },
    });
    if (!walletAccount) {
      sendError(res, 404, "Cuenta virtual no encontrada.");
      return;
    }

    const bankBalance = parseFloat(
      bankAccount.get("balance")?.toString() ?? "0"
    );
    const walletBalance = parseFloat(
      walletAccount.get("balance")?.toString() ?? "0"
    );
    const depositAmount =
      typeof amount === "string" ? parseFloat(amount) : Number(amount);

    if (isNaN(depositAmount) || depositAmount <= 0) {
      sendError(res, 400, "Monto de depósito inválido.");
      return;
    }
    if (bankBalance < depositAmount) {
      sendError(res, 400, "Saldo insuficiente en la cuenta bancaria.");
      return;
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

    res.status(200).json({
      message: "Depósito realizado correctamente.",
      bankAccount: { id: bankAccount.id, balance: bankAccount.get("balance") },
      walletAccount: {
        id: walletAccount.id,
        balance: walletAccount.get("balance"),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error durante el depósito.",
      error: error.message,
    });
  }
};

export const listBankAccounts: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;

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

    res.status(200).json({ bankAccounts });
  } catch (error: any) {
    res.status(500).json({
      message: "Error del servidor al listar las cuentas bancarias.",
      error: error.message,
    });
  }
};
