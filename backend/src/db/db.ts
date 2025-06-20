// src/config/db.ts
import { Sequelize } from "sequelize";
import loadModels from "../models/_loader.js";
import { defineRelations } from "./relations.js";

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, NODE_ENV } = process.env;

export const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  {
    dialect: "postgres",
    logging: NODE_ENV === "development" ? console.log : false,
  }
);

export const models: Record<string, any> = {};

const initDatabase = async () => {
  try {
    const loadedModels = await loadModels(sequelize);
    Object.assign(models, loadedModels);

    defineRelations(models);

    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida.");
  } catch (err) {
    console.error("❌ Error inicializando base de datos:", err);
  }
};

export default initDatabase;
