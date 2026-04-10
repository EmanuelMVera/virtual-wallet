import { models } from '../db/db.js';
import { Op } from 'sequelize';

export const deposit = async (userId: number, amount: number) => {
  if (amount <= 0) throw { status: 400, message: 'El monto debe ser positivo.' };

  const user = await models.User.findByPk(userId);
  if (!user) throw { status: 404, message: 'Usuario no encontrado.' };

  user.balance = Number(user.balance) + Number(amount);
  await user.save();

  await models.Transaction.create({
    senderId: null,
    receiverId: userId,
    amount,
    type: 'load',
  });

  return { balance: Number(user.balance), message: 'Depósito exitoso' };
};

export const withdraw = async (userId: number, amount: number) => {
  if (amount <= 0) throw { status: 400, message: 'El monto debe ser positivo.' };

  const user = await models.User.findByPk(userId);
  if (!user) throw { status: 404, message: 'Usuario no encontrado.' };

  if (Number(user.balance) < Number(amount)) throw { status: 400, message: 'Saldo insuficiente.' };

  user.balance = Number(user.balance) - Number(amount);
  await user.save();

  await models.Transaction.create({
    senderId: userId,
    receiverId: userId,
    amount,
    type: 'withdraw',
  });

  return { balance: Number(user.balance), message: 'Retiro exitoso' };
};

export const transfer = async (senderId: number, targetAlias: string, amount: number) => {
  if (!targetAlias || amount <= 0) throw { status: 400, message: 'Datos inválidos.' };

  const sender = await models.User.findByPk(senderId);
  const receiver = await models.User.findOne({ where: { alias: targetAlias } });

  if (!sender) throw { status: 404, message: 'Emisor no encontrado.' };
  if (!receiver) throw { status: 404, message: 'Destinatario no encontrado.' };
  if (receiver.id === sender.id) throw { status: 400, message: 'No puedes transferirte a ti mismo.' };
  if (Number(sender.balance) < Number(amount)) throw { status: 400, message: 'Saldo insuficiente.' };

  sender.balance = Number(sender.balance) - Number(amount);
  receiver.balance = Number(receiver.balance) + Number(amount);

  await sender.save();
  await receiver.save();

  const tx = await models.Transaction.create({
    senderId: sender.id,
    receiverId: receiver.id,
    amount,
    type: 'transfer',
  });

  return { message: 'Transferencia realizada', transaction: tx, balance: Number(sender.balance) };
};

export const history = async (userId: number) => {
  const transactions = await models.Transaction.findAll({
    where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] },
    include: [
      { model: models.User, as: 'sender', attributes: ['firstName', 'lastName', 'alias', 'dni'], required: false },
      { model: models.User, as: 'receiver', attributes: ['firstName', 'lastName', 'alias', 'dni'], required: false },
    ],
    order: [['createdAt', 'DESC']],
  });

  return { transactions };
};