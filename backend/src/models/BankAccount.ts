import { Model, DataTypes, Sequelize, Optional } from "sequelize";

/**
 * Modelo para cuentas bancarias ficticias asociadas a un usuario.
 */
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
  declare id: number;
  declare userId: number;
  declare bankName: string;
  declare accountNumber: string;
  declare balance: string;

  /**
   * Define la relación con el modelo User.
   */
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
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "1000.00",
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
