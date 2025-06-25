import { Model, DataTypes, Sequelize, Optional } from "sequelize";
import bcrypt from "bcryptjs";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> {
  // Declaraciones solo para tipado, no sobrescriben getters/setters
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;

  // Método para comparar contraseñas
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.getDataValue("password"));
  }

  // Relación con otros modelos
  static associate(models: any) {
    this.hasMany(models.Account, { foreignKey: "userId", as: "accounts" });
    this.hasMany(models.BankAccount, {
      foreignKey: "userId",
      as: "bankAccounts",
    });
  }
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,

      // Hooks de Sequelize para hashear la contraseña antes de guardar
      hooks: {
        beforeCreate: async (user) => {
          console.log("Ejecutando hook beforeCreate para User");
          const password = user.getDataValue("password");
          if (password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            user.setDataValue("password", hash);
          }
        },
        beforeUpdate: async (user) => {
          const password = user.getDataValue("password");
          if (password && user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            user.setDataValue("password", hash);
          }
        },
      },
    }
  );

  return User;
};
