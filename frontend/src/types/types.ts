export type TransactionType = "load" | "withdraw" | "transfer";

export interface Transaction {
  id: number;
  senderDni: string | null;
  receiverDni: string;
  amount: number;
  type: TransactionType;
  createdAt: string; // El backend envía ISO String
}

export interface User {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alias: string;
  balance: number;
}

// Para las respuestas de Login/Registro
export interface AuthResponse {
  token: string;
  user: User;
}

// Utilidad para manejar errores del backend
export interface ApiError {
  message: string;
}