import { models } from "../db/db.js";
import { Op } from "sequelize";
import { generateToken } from "../utils/authUtils.js";

export const registerUser = async (payload: any) => {
  const { dni, firstName, lastName, email, phone, password, alias } = payload;

  if (!dni || !firstName || !lastName || !email || !phone || !password) {
    const error: any = new Error("Faltan datos obligatorios");
    error.status = 400;
    throw error;
  }

  const conditions: any[] = [{ email }, { dni }];
  if (alias) conditions.push({ alias });

  const existingUser = await models.User.findOne({
    where: { [Op.or]: conditions },
  });

  if (existingUser) {
    const error: any = new Error("Email/DNI/Alias ya registrado");
    error.status = 409;
    throw error;
  }

  const user = await models.User.create({
    dni,
    firstName,
    lastName,
    email,
    phone,
    password,
    alias: alias?.trim().toLowerCase() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    balance: 0,
  });

  return {
    message: "Usuario registrado",
    user: {
      dni: user.dni,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      alias: user.alias,
      balance: Number(user.balance),
    },
  };
};

export const loginUser = async ({ email, password }: any) => {
  if (!email || !password) {
    const error: any = new Error("Credenciales inválidas");
    error.status = 400;
    throw error;
  }

  const user = await models.User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    const error: any = new Error("Email o contraseña incorrectos");
    error.status = 401;
    throw error;
  }

  const token = generateToken({ dni: user.dni, email: user.email });

  return {
    message: "Inicio de sesión exitoso",
    token,
    user: {
      dni: user.dni,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      alias: user.alias,
      balance: Number(user.balance),
    },
  };
};

export const getMe = async (dni: string) => {
  const user = await models.User.findByPk(dni, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    const error: any = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }

  return {
    user: {
      dni: user.dni,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      alias: user.alias,
      balance: Number(user.balance),
    },
  };
};

export const updateProfile = async (dni: string, update: any) => {
  const user = await models.User.findByPk(dni);
  if (!user) {
    const error: any = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }

  const { firstName, lastName, email, phone, alias } = update;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (alias) user.alias = alias;

  await user.save();

  return {
    user: {
      dni: user.dni,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      alias: user.alias,
      balance: Number(user.balance),
    },
  };
};

export const updatePassword = async (dni: string, password: string) => {
  if (!password) {
    const error: any = new Error("Password es requerido");
    error.status = 400;
    throw error;
  }

  const user = await models.User.findByPk(dni);
  if (!user) {
    const error: any = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }

  user.password = password;
  await user.save();

  return { message: "Contraseña actualizada" };
};
