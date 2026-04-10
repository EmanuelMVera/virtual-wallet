import { Model, DataTypes, Sequelize } from "sequelize";

interface TransactionAttributes {
  id: number;
  senderId: number | null;
  receiverId: number;
  amount: number;
  type: "load" | "withdraw" | "transfer";
  createdAt: Date;
}

export class Transaction
  extends Model<TransactionAttributes>
  implements TransactionAttributes
{
  declare id: number;
  declare senderId: number | null;
  declare receiverId: number;
  declare amount: number;
  declare type: "load" | "withdraw" | "transfer";
  declare createdAt: Date;

  static associate(models: any) {
    this.belongsTo(models.User, {
      foreignKey: "senderId",
      as: "sender",
    });
    this.belongsTo(models.User, {
      foreignKey: "receiverId",
      as: "receiver",
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
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: { min: 0.01 },
      },
      type: {
        type: DataTypes.ENUM("load", "withdraw", "transfer"),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
      timestamps: false,
    }
  );

  return Transaction;
};