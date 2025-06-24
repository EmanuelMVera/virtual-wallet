import { Model, DataTypes, Sequelize, Optional } from "sequelize";

interface TransactionAttributes {
  id: number;
  senderAccountId: number;
  receiverAccountId: number;
  amount: string; // Cambiado de number a string
  timestamp: Date;
}

interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, "id" | "timestamp"> {}

export class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: number;
  public senderAccountId!: number;
  public receiverAccountId!: number;
  public amount!: string; // Cambiado de number a string
  public timestamp!: Date;

  //relacion con otros modelos
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
        allowNull: false,
        references: {
          model: "accounts", // Referencia a la tabla 'accounts'
          key: "id",
        },
      },
      receiverAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "accounts", // Referencia a la tabla 'accounts'
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
