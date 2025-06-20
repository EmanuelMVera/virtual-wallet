import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

// Define una interfaz para el payload decodificado del JWT
export interface CustomJwtPayload extends JwtPayload {
  id?: string; // O number, según como guardes el ID en el token
  // Puedes agregar aquí otras propiedades específicas del JWT
}

// Extiende la interfaz Request de Express para incluir 'user'
declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload; // 'user' es opcional
    }
  }
}
