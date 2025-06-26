import { JwtPayload } from "jsonwebtoken";

/**
 * Interfaz personalizada para el payload decodificado del JWT.
 * Puedes extender esta interfaz con las propiedades específicas que almacenas en tu token.
 */
export interface CustomJwtPayload extends JwtPayload {
  id?: string; // ID del usuario (puede ser string o number según tu implementación)
  // Agrega aquí otras propiedades personalizadas del JWT si las necesitas
}

/**
 * Extensión de la interfaz Request de Express para incluir la propiedad 'user'.
 * Esto permite acceder a 'req.user' tipado correctamente en tus middlewares y controladores.
 */
declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload; // Propiedad opcional con la información del usuario autenticado
    }
  }
}
