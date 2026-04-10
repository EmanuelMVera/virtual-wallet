import { models } from "../db/db.js";
import { Op } from "sequelize";
import { generateToken } from "../utils/authUtils.js";

const cleanDniString = (dni: any) => dni?.toString().replace(/\D/g, "");

export const registerUser = async (payload: any) => {
  const { dni, firstName, lastName, email, phone, password, alias } = payload;
  const cleanDni = cleanDniString(dni);

  if (!cleanDni || !firstName || !lastName || !email || !phone || !password) {
    const error: any = new Error("Faltan datos obligatorios");
    error.status = 400;
    throw error;
  }

  const existingUser = await models.User.findOne({
    where: { [Op.or]: [{ email }, { dni: cleanDni }, { alias: alias || '' }] },
  });

  if (existingUser) {
    const error: any = new Error("Email/DNI/Alias ya registrado");
    error.status = 409;
    throw error;
  }

  const user = await models.User.create({
    dni: cleanDni,
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
    user: { id: user.id, dni: user.dni, firstName: user.firstName, lastName: user.lastName, email: user.email, alias: user.alias, balance: 0 },
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

  const token = generateToken({ id: user.id, email: user.email });

  return {
    message: "Inicio de sesión exitoso",
    token,
    user: { id: user.id, dni: user.dni, firstName: user.firstName, lastName: user.lastName, email: user.email, alias: user.alias, balance: Number(user.balance) },
  };
};

export const getMe = async (id: number) => {
  const user = await models.User.findByPk(id, { attributes: { exclude: ["password"] } });
  if (!user) {
    const error: any = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }
  return { user: { id: user.id, dni: user.dni, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, alias: user.alias, balance: Number(user.balance) } };
};

export const updateProfile = async (id: number, update: any) => {
  const user = await models.User.findByPk(id);
  if (!user) throw { status: 404, message: "Usuario no encontrado" };

  const { firstName, lastName, email, phone, alias } = update;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (alias) user.alias = alias;

  await user.save();
  return { user: { id: user.id, dni: user.dni, firstName: user.firstName, lastName: user.lastName, email: user.email, alias: user.alias, balance: Number(user.balance) } };
};

export const updatePassword = async (id: number, password: string) => {
  if (!password) throw { status: 400, message: "Password es requerido" };
  const user = await models.User.findByPk(id);
  if (!user) throw { status: 404, message: "Usuario no encontrado" };
  user.password = password;
  await user.save();
  return { message: "Contraseña actualizada" };
};