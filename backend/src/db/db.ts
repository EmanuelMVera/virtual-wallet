// src/config/db.ts
import { Sequelize } from "sequelize";
import loadModels from "../models/_loader.js";
import { defineRelations } from "./relations.js";
import dotenv from "dotenv";
dotenv.config(); // Cargar variables de entorno desde .env

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, NODE_ENV } = process.env;

export const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  {
    dialect: "postgres",
    logging: NODE_ENV === "development" ? console.log : false,
  }
);

export const models: Record<string, any> = {}; // Usa SIEMPRE esta instancia

const initDatabase = async () => {
  try {
    const loadedModels = await loadModels(sequelize);
    Object.assign(models, loadedModels);

    defineRelations(models);

    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    //alter true permite que Sequelize ajuste las tablas existentes para que coincidan con los modelos definidos, sin perder datos.
    // Si deseas forzar la sincronización y eliminar datos existentes, usa { force: true } en lugar de { alter: true }
    // alter:false no sincroniza los modelos con la base de datos, por lo que no se crean ni actualizan tablas.
    console.log("✅ Modelos sincronizados con la base de datos.");
    console.log("✅ Conexión a la base de datos establecida.");
  } catch (err) {
    console.error("❌ Error inicializando base de datos:", err);
  }
};

export default initDatabase;
