import { models } from '../db/db.js';
import { Op } from 'sequelize';

export const deposit = async (dni: string, amount: number) => {
  if (amount <= 0) {
    const error: any = new Error('El monto debe ser positivo.');
    error.status = 400;
    throw error;
  }

  const user = await models.User.findByPk(dni);
  if (!user) {
    const error: any = new Error('Usuario no encontrado.');
    error.status = 404;
    throw error;
  }

  user.balance = Number(user.balance) + Number(amount);
  await user.save();

  await models.Transaction.create({
    senderDni: null,
    receiverDni: dni,
    amount,
    type: 'load',
  });

  return {
    balance: Number(user.balance),
    message: 'Depósito exitoso',
  };
};

export const withdraw = async (dni: string, amount: number) => {
  if (amount <= 0) {
    const error: any = new Error('El monto debe ser positivo.');
    error.status = 400;
    throw error;
  }

  const user = await models.User.findByPk(dni);
  if (!user) {
    const error: any = new Error('Usuario no encontrado.');
    error.status = 404;
    throw error;
  }

  if (Number(user.balance) < Number(amount)) {
    const error: any = new Error('Saldo insuficiente.');
    error.status = 400;
    throw error;
  }

  user.balance = Number(user.balance) - Number(amount);
  await user.save();

  await models.Transaction.create({
    senderDni: dni,
    receiverDni: dni,
    amount,
    type: 'withdraw',
  });

  return {
    balance: Number(user.balance),
    message: 'Retiro exitoso',
  };
};

export const transfer = async (
  dni: string,
  targetAlias: string,
  amount: number,
) => {
  if (!targetAlias || amount <= 0) {
    const error: any = new Error('Datos inválidos para transferencia.');
    error.status = 400;
    throw error;
  }

  const sender = await models.User.findByPk(dni);
  if (!sender) {
    const error: any = new Error('Usuario emisor no encontrado.');
    error.status = 404;
    throw error;
  }

  const receiver = await models.User.findOne({ where: { alias: targetAlias } });
  if (!receiver) {
    const error: any = new Error('Alias destino no encontrado.');
    error.status = 404;
    throw error;
  }

  if (receiver.dni === sender.dni) {
    const error: any = new Error('No puede transferirse a sí mismo.');
    error.status = 400;
    throw error;
  }

  if (Number(sender.balance) < Number(amount)) {
    const error: any = new Error('Saldo insuficiente.');
    error.status = 400;
    throw error;
  }

  sender.balance = Number(sender.balance) - Number(amount);
  receiver.balance = Number(receiver.balance) + Number(amount);

  await sender.save();
  await receiver.save();

  const tx = await models.Transaction.create({
    senderDni: sender.dni,
    receiverDni: receiver.dni,
    amount,
    type: 'transfer',
  });

  return {
    message: 'Transferencia realizada',
    transaction: tx,
    balances: {
      sender: Number(sender.balance),
      receiver: Number(receiver.balance),
    },
  };
};

export const history = async (dni: string) => {
  const user = await models.User.findByPk(dni);
  if (!user) {
    const error: any = new Error('Usuario no encontrado.');
    error.status = 404;
    throw error;
  }

  const transactions = await models.Transaction.findAll({
    where: {
      [Op.or]: [{ senderDni: dni }, { receiverDni: dni }],
    },
    include: [
      {
        model: models.User,
        as: 'sender',
        attributes: ['firstName', 'lastName', 'alias'],
        required: false,
      },
      {
        model: models.User,
        as: 'receiver',
        attributes: ['firstName', 'lastName', 'alias'],
        required: false,
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  return {
    transactions,
  };
};
