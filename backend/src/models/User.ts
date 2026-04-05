import { Model, DataTypes, Sequelize } from "sequelize";
import bcrypt from "bcryptjs";

interface UserAttributes {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  alias: string;
  balance: number;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  declare dni: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phone: string;
  declare password: string;
  declare alias: string;
  declare balance: number;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  static associate(models: any) {
    this.hasMany(models.Transaction, {
      foreignKey: "senderDni",
      as: "sentTransactions",
    });
    this.hasMany(models.Transaction, {
      foreignKey: "receiverDni",
      as: "receivedTransactions",
    });
  }
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      dni: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alias: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      balance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          const email = user.email?.toLowerCase();
          if (email) user.email = email;
          if (user.password) user.password = await bcrypt.hash(user.password, 10);
          if (!user.alias) user.alias = `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}`;
        },
        beforeUpdate: async (user) => {
          if (user.changed("email") && user.email) {
            user.email = user.email.toLowerCase();
          }
          if (user.changed("password") && user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  return User;
};
