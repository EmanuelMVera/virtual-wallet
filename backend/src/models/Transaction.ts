// import { DataTypes } from "sequelize";

// const TransactionModel = (sequelize) => {
//   const Transaction = sequelize.define(
//     "Transaction",
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       senderAccountId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//           model: "accounts", // Referencia a la tabla 'accounts'
//           key: "id",
//         },
//       },
//       receiverAccountId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//           model: "accounts", // Referencia a la tabla 'accounts'
//           key: "id",
//         },
//       },
//       amount: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false,
//         validate: {
//           min: 0.01, // Una transacción debe tener un monto positivo
//         },
//       },
//       timestamp: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//       },
//     },
//     {
//       tableName: "transactions",
//       timestamps: false, // Las transacciones generalmente tienen su propio timestamp
//     }
//   );

//   return Transaction;
// };

// export default TransactionModel;
