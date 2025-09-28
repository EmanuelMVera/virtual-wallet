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
  type: "deposit" | "transfer" | "transfer_in" | "transfer_out";
  amount: number;
  timestamp?: string; // puede llegar undefined en algunos casos
  senderAccountId?: number | null;
  receiverAccountId?: number | null;
};


export type BankAccount = {
  id: number;
  bankName: string;
  accountNumber: string;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
};
