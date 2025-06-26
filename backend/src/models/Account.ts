import { Model, DataTypes, Sequelize, Optional } from "sequelize";

/**
 * Modelo para cuentas virtuales de la billetera.
 */
interface AccountAttributes {
  id: number;
  userId: number;
  balance: string;
  alias?: string;
  cbu?: string;
}

interface AccountCreationAttributes extends Optional<AccountAttributes, "id"> {}

export class Account extends Model<
  AccountAttributes,
  AccountCreationAttributes
> {
  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: "userId", as: "owner" });
    this.hasMany(models.Transaction, {
      foreignKey: "senderAccountId",
      as: "sentTransactions",
    });
    this.hasMany(models.Transaction, {
      foreignKey: "receiverAccountId",
      as: "receivedTransactions",
    });
  }
}

export default (sequelize: Sequelize) => {
  Account.init(
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
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      alias: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      cbu: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Account",
      tableName: "accounts",
      timestamps: true,
    }
  );

  return Account;
};
