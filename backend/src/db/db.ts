import { Sequelize } from "sequelize";
import loadModels from "../models/_loader.js";
import { defineRelations } from "./relations.js";
import dotenv from "dotenv";

// Carga las variables de entorno desde .env
dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, NODE_ENV } = process.env;

// Instancia principal de Sequelize para la conexión a la base de datos
export const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  {
    dialect: "postgres",
    logging: NODE_ENV === "development" ? console.log : false,
  }
);

// Objeto global para almacenar los modelos cargados
export const models: Record<string, any> = {};

/**
 * Inicializa la base de datos:
 * - Carga dinámicamente los modelos
 * - Define relaciones entre modelos
 * - Autentica la conexión
 * - Sincroniza los modelos con la base de datos
 */
const initDatabase = async () => {
  try {
    // Carga todos los modelos dinámicamente
    const loadedModels = await loadModels(sequelize);
    Object.assign(models, loadedModels);

    // Define las relaciones entre los modelos
    defineRelations(models);

    // Verifica la conexión a la base de datos
    await sequelize.authenticate();

    // Sincroniza los modelos con la base de datos
    await sequelize.sync({ alter: true });
    // alter: true ajusta las tablas existentes para que coincidan con los modelos definidos, sin perder datos.
    // Si deseas forzar la sincronización y eliminar datos existentes, usa { force: true } en lugar de { alter: true }
    // alter: false no sincroniza los modelos con la base de datos.

    console.log("✅ Modelos sincronizados con la base de datos.");
    console.log("✅ Conexión a la base de datos establecida.");
  } catch (err) {
    console.error("❌ Error inicializando base de datos:", err);
  }
};

export default initDatabase;
