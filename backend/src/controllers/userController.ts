import { Request, Response } from "express";
import { models } from "../db/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Op } from "sequelize"; // <--- Agrega esta línea

dotenv.config(); // Cargar variables de entorno

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Obtén el modelo User dinámicamente
    const User = models.User;

    // 1. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists." });
      return;
    }

    // 2. Crear el nuevo usuario (el hook beforeCreate en el modelo hashea la contraseña)
    const newUser = await User.create({ name, email, password });

    // Crear una cuenta inicial para el nuevo usuario con alias y cbu únicos
    const Account = models.Account;
    let alias: string, cbu: string;
    let isUnique = false;
    do {
      alias = `alias${Math.random().toString(36).substring(2, 10)}`;
      cbu = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
      const exists = await Account.findOne({
        where: { [Op.or]: [{ alias }, { cbu }] }, // <--- Usa Op importado
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

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Obtén el modelo User dinámicamente
    const User = models.User;

    // 1. Buscar al usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    // 2. Comparar la contraseña (usando el método del modelo)
    if (!(user as any).password) {
      res.status(500).json({ message: "User password not set in database." });
      return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    // 3. Generar el JWT
    const payload: { id: number; email: string } = {
      id: Number(user.id),
      email: String(user.email),
    };

    // Usa el secreto como string directamente
    const secret = process.env.JWT_SECRET as string;

    const expiresIn = process.env.JWT_EXPIRATION_TIME
      ? Number(process.env.JWT_EXPIRATION_TIME)
      : 3600; // valor por defecto: 1 hora

    const token = jwt.sign(payload, secret, {
      expiresIn,
    });

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

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    message:
      "Logged out successfully. Please remove your token on client side.",
  });
};
