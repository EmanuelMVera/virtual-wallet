import { Model, DataTypes, Sequelize, Optional } from "sequelize";

interface AccountAttributes {
  id: number;
  userId: number;
  balance: number;
}

interface AccountCreationAttributes extends Optional<AccountAttributes, "id"> {}

export class Account
  extends Model<AccountAttributes, AccountCreationAttributes>
  implements AccountAttributes
{
  public id!: number;
  public userId!: number;
  public balance!: number;

  // Relación con otros modelos
  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: "userId", as: "owner" });
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
          model: "users", // Referencia a la tabla 'users'
          key: "id",
        },
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2), // Por ejemplo, 10 dígitos en total, 2 decimales
        allowNull: false,
        defaultValue: 0.0,
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
