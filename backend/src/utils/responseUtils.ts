import { Response } from "express";

/**
 * Envía una respuesta de error estandarizada.
 */
export function sendError(res: Response, status: number, message: string) {
  return res.status(status).json({ message });
}
