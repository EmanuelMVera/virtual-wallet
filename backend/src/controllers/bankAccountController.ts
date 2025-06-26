import { Request, Response } from "express";
import { models } from "../db/db.js";

// Registrar una cuenta bancaria ficticia
export const registerBankAccount = async (req: Request, res: Response) => {
  try {
    const { bankName, accountNumber } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }
    const BankAccount = models.BankAccount;
    const bankAccount = await BankAccount.create({
      userId,
      bankName,
      accountNumber,
      balance: 1000.0, // saldo ficticio inicial
    });
    res.status(201).json({ message: "Bank account registered.", bankAccount });
  } catch (error: any) {
    res.status(500).json({
      message: "Error registering bank account.",
      error: error.message,
    });
  }
};

// Simular depósito desde cuenta bancaria a la billetera virtual
export const depositToWallet = async (req: Request, res: Response) => {
  try {
    const { bankAccountId, walletAccountId, amount } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }
    const BankAccount = models.BankAccount;
    const Account = models.Account;

    // Verifica que la cuenta bancaria pertenezca al usuario
    const bankAccount = await BankAccount.findOne({
      where: { id: bankAccountId, userId },
    });
    if (!bankAccount) {
      res.status(404).json({ message: "Bank account not found." });
      return;
    }
    // Verifica que la cuenta virtual pertenezca al usuario
    const walletAccount = await Account.findOne({
      where: { id: walletAccountId, userId },
    });
    if (!walletAccount) {
      res.status(404).json({ message: "Wallet account not found." });
      return;
    }

    // LOG para depuración
    console.log(
      "BankAccount balance:",
      bankAccount.get("balance"),
      "Amount:",
      amount
    );

    // Convierte los balances a número de forma segura (soporta string y number)
    const bankBalance = parseFloat(bankAccount.get("balance") ?? "0");
    const walletBalance = parseFloat(walletAccount.get("balance") ?? "0");
    const depositAmount =
      typeof amount === "string" ? parseFloat(amount) : Number(amount);

    console.log(
      "Parsed bankBalance:",
      bankBalance,
      "Parsed depositAmount:",
      depositAmount
    );

    if (isNaN(bankBalance) || isNaN(walletBalance) || isNaN(depositAmount)) {
      res.status(400).json({ message: "Invalid balance or amount." });
      return;
    }

    if (bankBalance < depositAmount) {
      res.status(400).json({ message: "Insufficient bank account balance." });
      return;
    }

    // Realiza el depósito
    bankAccount.set("balance", (bankBalance - depositAmount).toFixed(2));
    walletAccount.set("balance", (walletBalance + depositAmount).toFixed(2));
    await bankAccount.save();
    await walletAccount.save();

    // Registra la transacción en la tabla transactions
    const Transaction = models.Transaction;
    await Transaction.create({
      senderAccountId: null,
      receiverAccountId: walletAccount.id,
      amount: depositAmount,
      type: "deposit", // <--- Nuevo campo
    });

    res.status(200).json({
      message: "Deposit successful.",
      bankAccount: { id: bankAccount.id, balance: bankAccount.get("balance") },
      walletAccount: {
        id: walletAccount.id,
        balance: walletAccount.get("balance"),
      },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error during deposit.", error: error.message });
  }
};

// Listar cuentas bancarias del usuario autenticado
export const listBankAccounts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated." });
      return;
    }
    const BankAccount = models.BankAccount;
    const bankAccounts = await BankAccount.findAll({
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
      message: "Error listing bank accounts.",
      error: error.message,
    });
  }
};
