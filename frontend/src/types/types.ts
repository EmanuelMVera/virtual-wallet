export type TransactionType = "load" | "withdraw" | "transfer";

export interface TransactionParty {
  firstName: string;
  lastName: string;
  alias: string;
}

export interface Transaction {
  id: number;
  senderDni: string | null;
  receiverDni: string;
  amount: number;
  type: TransactionType;
  createdAt: string;
  sender?: TransactionParty | null;
  receiver?: TransactionParty | null;
}

export interface User {
  id: number;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alias: string;
  balance: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
}
