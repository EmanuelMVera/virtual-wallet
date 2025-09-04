export type ApiErrorBody = {
  message?: string;
  error?: string;
  details?: unknown;
};

export type User = { id: number; name: string; email: string };

export type Account = {
  id: number;
  alias: string;
  cbu: string;
  balance: number;
  // El backend no envía "currency" aquí
};

export type Transaction = {
  id: number;
  senderAccountId: number | null;
  receiverAccountId: number;
  amount: number;
  type: "transfer" | "deposit";
  timestamp?: string; // si tu modelo lo expone así
};

export type BankAccount = {
  id: number;
  bankName: string;
  accountNumber: string;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
};
