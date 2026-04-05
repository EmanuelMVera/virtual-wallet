import { Model, DataTypes, Sequelize } from "sequelize";

interface TransactionAttributes {
  id: number;
  senderDni: string | null;
  receiverDni: string;
  amount: number;
  type: "load" | "withdraw" | "transfer";
  createdAt: Date;
}

export class Transaction
  extends Model<TransactionAttributes>
  implements TransactionAttributes
{
  declare id: number;
  declare senderDni: string | null;
  declare receiverDni: string;
  declare amount: number;
  declare type: "load" | "withdraw" | "transfer";
  declare createdAt: Date;

  static associate(models: any) {
    this.belongsTo(models.User, {
      foreignKey: "senderDni",
      targetKey: "dni",
      as: "sender",
    });
    this.belongsTo(models.User, {
      foreignKey: "receiverDni",
      targetKey: "dni",
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
      senderDni: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "users",
          key: "dni",
        },
      },
      receiverDni: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "dni",
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
