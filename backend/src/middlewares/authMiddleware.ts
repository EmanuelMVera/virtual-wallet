import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // Lanza un error si no está definido, lo que detendrá la aplicación al inicio
  // si la variable de entorno falta.
  throw new Error("JWT_SECRET must be defined in .env file");
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;

  // 1. Verificar si el token está presente en los headers (Bearer Token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Obtener el token después de 'Bearer'

      // Ahora JWT_SECRET es garantizado como string por la verificación anterior
      const decoded = jwt.verify(token, JWT_SECRET); // Casteamos a tu interfaz

      // 3. Adjuntar la información del usuario al objeto request (req.user)
      // En una aplicación real, a menudo buscarías el usuario en la BD
      // para asegurar que sigue existiendo y está activo.
      // Por simplicidad, aquí solo adjuntamos el payload decodificado.
      req.user = decoded;
      return next(); // Continuar con la siguiente función en la cadena de middleware/ruta
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ message: "Not authorized, token failed." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token." });
  }
};
