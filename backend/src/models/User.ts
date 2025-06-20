import { Model, DataTypes, Sequelize, Optional } from "sequelize";
import bcrypt from "bcryptjs";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

// Definición del modelo de usuario
// Este modelo representa a un usuario en la base de datos y contiene los campos necesarios para la autenticación y autorización.
// Incluye métodos para comparar contraseñas y hashear la contraseña antes de guardarla en la base de datos.
// Utiliza bcrypt para el hashing de contraseñas y Sequelize como ORM para interactuar con la base de datos.
// Además, implementa hooks de Sequelize para asegurar que las contraseñas se hashean antes
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;

  // Método para comparar contraseñas
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Relación con otros modelos
  static associate(models: any) {
    this.hasMany(models.Account, { foreignKey: "userId", as: "accounts" });
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
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password && user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  return User;
};
