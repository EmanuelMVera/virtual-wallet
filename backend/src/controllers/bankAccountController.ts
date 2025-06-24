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
    res
      .status(500)
      .json({
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
    if (Number(bankAccount.balance) < Number(amount)) {
      res.status(400).json({ message: "Insufficient bank account balance." });
      return;
    }

    // Realiza el depósito
    bankAccount.balance = (
      Number(bankAccount.balance) - Number(amount)
    ).toFixed(2);
    walletAccount.balance = (
      Number(walletAccount.balance) + Number(amount)
    ).toFixed(2);
    await bankAccount.save();
    await walletAccount.save();

    res.status(200).json({
      message: "Deposit successful.",
      bankAccount: { id: bankAccount.id, balance: bankAccount.balance },
      walletAccount: { id: walletAccount.id, balance: walletAccount.balance },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error during deposit.", error: error.message });
  }
};
