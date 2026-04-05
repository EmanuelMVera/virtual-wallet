import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CustomJwtPayload } from '../../custom.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET debe estar definida en el archivo .env');
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // Limpieza del token por si viene con comillas
      let token = authHeader.split(' ')[1].trim();
      token = token.replace(/^"|"$/g, ''); // elimina comillas dobles si las hay

      const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
      req.user = decoded;
      return next();
    } catch (error) {
      console.error('❌ Error en verificación JWT:', error);
      res.status(401).json({ message: 'Usuario no autenticado.' });
      return;
    }
  }

  res.status(401).json({ message: 'Usuario no autenticado.' });
};
