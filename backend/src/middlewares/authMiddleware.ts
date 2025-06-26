import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomJwtPayload } from "../../custom.d.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // Detiene la aplicación si falta la variable de entorno
  throw new Error("JWT_SECRET must be defined in .env file");
}

/**
 * Middleware para proteger rutas usando autenticación JWT.
 * Verifica el token y adjunta el payload decodificado a req.user.
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  // Verifica si el token está presente en los headers (Bearer Token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verifica y decodifica el token JWT
      const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

      // Adjunta el payload decodificado al objeto request
      (req as any).user = decoded;
      return next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ message: "Not authorized, token failed." });
      return;
    }
  }

  // Si no hay token, responde con error de autorización
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token." });
    return;
  }
};
