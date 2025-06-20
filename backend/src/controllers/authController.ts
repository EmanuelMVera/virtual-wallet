import { Request, Response } from "express";
import { models } from "../db/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno

const { User } = models;

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    // 2. Crear el nuevo usuario (el hook beforeCreate en el modelo hashea la contraseña)
    const newUser = await User.create({ name, email, password });

    // 3. Opcional: Crear una cuenta inicial para el nuevo usuario
    // Suponiendo que quieres crear una cuenta por defecto para cada usuario
    // const newAccount = await Account.create({ userId: newUser.id, balance: 0.00 });

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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar al usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 2. Comparar la contraseña (usando el método del modelo)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 3. Generar el JWT
    const payload = {
      id: user.id,
      email: user.email,
      // Puedes añadir más datos aquí, pero evita información sensible
    };

    // La clave secreta debe ser una variable de entorno y muy segura
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRATION_TIME || "1h" } // Por ejemplo, 1 hora
    );

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
