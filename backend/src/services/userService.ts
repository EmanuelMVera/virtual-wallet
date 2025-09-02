import { models } from "../db/db.js";
import { generateAlias, generateCbu } from "../utils/accountUtils.js";
import { generateToken } from "../utils/authUtils.js";
import { Op } from "sequelize";
import User from "../models/User"; // Ajusta el import según tu estructura/modelo

export const registerUser = async ({ name, email, password }: any) => {
  const User = models.User;
  const Account = models.Account;

  // Verificar si el email ya está registrado
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error: any = new Error("Ya existe un usuario con este email.");
    error.status = 409;
    throw error;
  }

  const newUser = await User.create({ name, email, password });

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

  return {
    message: "¡Usuario registrado exitosamente!",
    user: { id: newUser.id, email: newUser.email, name: newUser.name },
  };
};

export const loginUser = async ({ email, password }: any) => {
  const User = models.User;

  const user = await User.findOne({ where: { email } });
  if (!user || !(user as any).password) {
    const error: any = new Error("Credenciales inválidas.");
    error.status = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error: any = new Error("Contraseña inválida.");
    error.status = 401;
    throw error;
  }

  const token = generateToken({ id: user.id, email: user.email });

  return {
    message: "¡Inicio de sesión exitoso!",
    token,
    user: { id: user.id, email: user.email, name: user.name },
  };
};

export const getMe = async (userId: number) => {
  const User = models.User;
  // Busca el usuario por su ID y excluye campos sensibles como password
  return await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
};
