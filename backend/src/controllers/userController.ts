import { RequestHandler } from "express";
import { models } from "../db/db.js";
import { validationResult } from "express-validator";
import { generateAlias, generateCbu } from "../utils/accountUtils.js";
import { generateToken } from "../utils/authUtils.js";
import { sendError } from "../utils/responseUtils.js";
import { Op } from "sequelize";

export const register: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { name, email, password } = req.body;
    const User = models.User;

    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      sendError(res, 409, "Ya existe un usuario con este email.");
      return;
    }

    const newUser = await User.create({ name, email, password });
    const Account = models.Account;

    // Generar alias y CBU únicos
    let alias: string,
      cbu: string,
      isUnique = false;
    const [firstName, lastName = "user"] = name.trim().toLowerCase().split(" ");

    do {
      alias = generateAlias(firstName, lastName);
      cbu = generateCbu();

      const exists = await Account.findOne({
        where: { [Op.or]: [{ alias }, { cbu }] },
      });
      isUnique = !exists;
    } while (!isUnique);

    await Account.create({
      userId: newUser.id,
      balance: 100.0, // saldo inicial para pruebas
      alias,
      cbu,
    });

    res.status(201).json({
      message: "¡Usuario registrado exitosamente!",
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error: any) {
    console.error("Error durante el registro:", error);
    res.status(500).json({
      message: "Error del servidor durante el registro.",
      error: error.message,
    });
  }
};

export const login: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { email, password } = req.body;
    const User = models.User;

    const user = await User.findOne({ where: { email } });
    if (!user || !(user as any).password) {
      sendError(res, 401, "Credenciales inválidas.");
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 401, "Contraseña inválida.");
      return;
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.status(200).json({
      message: "¡Inicio de sesión exitoso!",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    console.error("Error durante el inicio de sesión:", error);
    res.status(500).json({
      message: "Error del servidor durante el inicio de sesión.",
      error: error.message,
    });
  }
};

export const logout: RequestHandler = async (_req, res) => {
  res.status(200).json({ message: "Sesión cerrada correctamente." });
};
