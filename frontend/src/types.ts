export type User = { id: number; name: string; email: string };

export type Account = {
  id: number;
  userId: number;
  alias: string;
  cbu: string;
  balance: number;
  currency: "ARS" | "USD";
  updatedAt: string;
};

export type Transaction = {
  id: number;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  currency: "ARS" | "USD";
  concept?: string;
  createdAt: string;
};

export type BankAccount = {
  id: number;
  userId: number;
  bankName: string;
  cbu: string;
  alias?: string;
};
