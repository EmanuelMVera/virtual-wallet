import { generateToken } from "../../src/utils/authUtils.js";
import jwt from "jsonwebtoken";

describe("Utils - Auth", () => {
  const payload = { id: 1, email: "test@mail.com" };
  const secret = process.env.JWT_SECRET || "defaultSecret"; // debe coincidir con authUtils

  it("debe generar un token JWT válido", () => {
    const token = generateToken(payload, 60); // usa la misma clave que authUtils
    const decoded = jwt.verify(token, secret) as { id: number; email: string };
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
  });

  it("debe generar tokens con expiración personalizada", () => {
    const token = generateToken(payload, 120);
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    expect(decoded.exp).toBeDefined();
  });
});
