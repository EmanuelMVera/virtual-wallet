import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomJwtPayload } from "../../custom.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET debe estar definida en el archivo .env");
}

/**
 * Middleware para proteger rutas usando autenticación JWT.
 * Devuelve siempre un 401 con el mensaje unificado: "Usuario no autenticado."
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

      req.user = decoded;
      return next();
    } catch {
      res.status(401).json({ message: "Usuario no autenticado." });
      return;
    }
  }

  res.status(401).json({ message: "Usuario no autenticado." });
};
