import { models } from "../db/db.js";

export const getUserAccountData = async (userId: number) => {
  const Account = models.Account;

  const existingAccount = await Account.findOne({ where: { userId } });
  if (!existingAccount) {
    const error: any = new Error("Cuenta no encontrada para este usuario.");
    error.status = 404;
    throw error;
  }

  return {
    message: "Datos de la cuenta obtenidos correctamente.",
    account: {
      id: existingAccount.id,
      alias: existingAccount.alias,
      cbu: existingAccount.cbu,
      balance: existingAccount.balance,
    },
  };
};

export const findAccount = async (alias: any, cbu: any) => {
  if (!alias && !cbu) {
    const error: any = new Error(
      "Proporcione alias o cbu como parámetro de consulta."
    );
    error.status = 400;
    throw error;
  }

  const existingAccount = await models.Account.findOne({
    where: alias ? { alias } : { cbu },
  });

  if (!existingAccount) {
    const error: any = new Error("Cuenta no encontrada.");
    error.status = 404;
    throw error;
  }

  return {
    message: "Datos de la cuenta obtenidos correctamente.",
    account: {
      id: existingAccount.id,
      alias: existingAccount.alias,
      cbu: existingAccount.cbu,
    },
  };
};
