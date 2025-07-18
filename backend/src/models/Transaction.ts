import { Model, DataTypes, Sequelize, Optional } from "sequelize";

/**
 * Modelo para transacciones (transferencias y depósitos).
 */
interface TransactionAttributes {
  id: number;
  senderAccountId: number | null;
  receiverAccountId: number;
  amount: string;
  timestamp: Date;
  type: string;
}

interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, "id" | "timestamp" | "type"> {}

export class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  declare id: number;
  declare senderAccountId: number | null;
  declare receiverAccountId: number;
  declare amount: string;
  declare timestamp: Date;
  declare type: string;

  static associate(models: any) {
    this.belongsTo(models.Account, {
      foreignKey: "senderAccountId",
      as: "senderAccount",
    });
    this.belongsTo(models.Account, {
      foreignKey: "receiverAccountId",
      as: "receiverAccount",
    });
  }
}

export default (sequelize: Sequelize) => {
  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      senderAccountId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permite null para depósitos desde banco
        references: {
          model: "accounts",
          key: "id",
        },
      },
      receiverAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "accounts",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01, // Una transacción debe tener un monto positivo
        },
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "transfer", // Por defecto es transferencia
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
      timestamps: false, // Las transacciones generalmente tienen su propio timestamp
    }
  );
  return Transaction;
};
