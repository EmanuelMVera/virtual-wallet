import { Request, Response } from "express";
import { models } from "../db/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

/**
 * Registra un nuevo usuario y crea una cuenta virtual inicial.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const User = models.User;

    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists." });
      return;
    }

    // Crea el nuevo usuario (el hook beforeCreate hashea la contraseña)
    const newUser = await User.create({ name, email, password });

    // Crea una cuenta inicial para el nuevo usuario con alias y cbu únicos
    const Account = models.Account;
    let alias: string, cbu: string;
    let isUnique = false;
    const [firstName, lastName] = name.trim().toLowerCase().split(" ");
    do {
      const randomWord = Math.random().toString(36).substring(2, 6);
      alias = `${firstName}.${lastName}.${randomWord}.vw`;
      cbu = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
      const exists = await Account.findOne({
        where: { [Op.or]: [{ alias }, { cbu }] },
      });
      isUnique = !exists;
    } while (!isUnique);

    await Account.create({
      userId: newUser.id,
      balance: 0.0,
      alias,
      cbu,
    });

    res.status(201).json({
      message: "User registered successfully!",
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error: any) {
    console.error("Error during registration:", error);
    res.status(500).json({
      message: "Server error during registration.",
      error: error.message,
    });
  }
};

/**
 * Inicia sesión y devuelve un JWT si las credenciales son válidas.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const User = models.User;

    // Busca al usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    // Compara la contraseña
    if (!(user as any).password) {
      res.status(500).json({ message: "User password not set in database." });
      return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    // Genera el JWT
    const payload: { id: number; email: string } = {
      id: Number(user.id),
      email: String(user.email),
    };
    const secret = process.env.JWT_SECRET as string;
    const expiresIn = process.env.JWT_EXPIRATION_TIME
      ? Number(process.env.JWT_EXPIRATION_TIME)
      : 3600;

    const token = jwt.sign(payload, secret, { expiresIn });

    res.status(200).json({
      message: "Logged in successfully!",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Server error during login.", error: error.message });
  }
};

/**
 * Cierra la sesión del usuario (elimina el token en el cliente).
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    message:
      "Logged out successfully. Please remove your token on client side.",
  });
};
