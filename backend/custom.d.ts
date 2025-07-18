import { JwtPayload } from "jsonwebtoken";

/**
 * Payload personalizado del JWT.
 * Extiende el payload estándar con propiedades específicas de la app.
 */
export interface CustomJwtPayload extends JwtPayload {
  id: number; // Forzamos number, ya que tus IDs son numéricos en DB
  email?: string;
}

/**
 * Extensión global de la interfaz Request de Express
 * para incluir la propiedad `user` con tipado completo.
 */
declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload; // Propiedad opcional para middlewares y controladores
    }
  }
}

export {}; // Para tratar este archivo como un módulo y evitar errores de duplicación
