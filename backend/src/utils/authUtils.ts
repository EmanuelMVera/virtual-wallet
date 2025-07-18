import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "defaultSecret";

/**
 * Genera un token JWT firmado.
 */
export function generateToken(payload: object, expiresIn = 3600): string {
  return jwt.sign(payload, secret, { expiresIn });
}
