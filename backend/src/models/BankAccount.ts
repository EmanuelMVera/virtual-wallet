import { Model, DataTypes, Sequelize, Optional } from "sequelize";

interface BankAccountAttributes {
  id: number;
  userId: number;
  bankName: string;
  accountNumber: string;
  balance: string;
}

interface BankAccountCreationAttributes
  extends Optional<BankAccountAttributes, "id"> {}

export class BankAccount
  extends Model<BankAccountAttributes, BankAccountCreationAttributes>
  implements BankAccountAttributes
{
  public id!: number;
  public userId!: number;
  public bankName!: string;
  public accountNumber!: string;
  public balance!: string;

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: "userId", as: "owner" });
  }
}

export default (sequelize: Sequelize) => {
  BankAccount.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      bankName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 1000.0, // saldo ficticio inicial
      },
    },
    {
      sequelize,
      modelName: "BankAccount",
      tableName: "bank_accounts",
      timestamps: true,
    }
  );
  return BankAccount;
};
