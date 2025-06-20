// // Relación entre Users y Accounts (One-to-Many)
// // Un usuario puede tener múltiples cuentas.
// User.hasMany(Account, {
//   foreignKey: "userId",
//   as: "accounts", // Alias para incluir cuentas de un usuario
// });

// // Una cuenta pertenece a un usuario.
// Account.belongsTo(User, {
//   foreignKey: "userId",
//   as: "owner", // Alias para incluir el propietario de una cuenta
// });

// // Relación entre Accounts y Transactions (One-to-Many, dos veces)
// // Una cuenta puede ser el origen (sender) de muchas transacciones.
// Account.hasMany(Transaction, {
//   foreignKey: "senderAccountId",
//   as: "sentTransactions", // Alias para transacciones enviadas por una cuenta
// });
// // Una transacción pertenece a una cuenta como sender.
// Transaction.belongsTo(Account, {
//   foreignKey: "senderAccountId",
//   as: "senderAccount", // Alias para la cuenta que envía
// });

// // Una cuenta puede ser el destino (receiver) de muchas transacciones.
// Account.hasMany(Transaction, {
//   foreignKey: "receiverAccountId",
//   as: "receivedTransactions", // Alias para transacciones recibidas por una cuenta
// });
// // Una transacción pertenece a una cuenta como receiver.
// Transaction.belongsTo(Account, {
//   foreignKey: "receiverAccountId",
//   as: "receiverAccount", // Alias para la cuenta que recibe
// });

export const defineRelations = (models: Record<string, any>) => {
  Object.values(models).forEach((model) => {
    if (typeof model.associate === "function") {
      model.associate(models);
    }
  });

  console.log("✔ Relaciones entre modelos definidas.");
};
