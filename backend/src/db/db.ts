import { Sequelize } from "sequelize";
import loadModels from "../models/_loader.js";
import { defineRelations } from "./relations.js";
import dotenv from "dotenv";

dotenv.config();
const isTest = process.env.NODE_ENV === "test";

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

// Instancia de Sequelize según entorno
export const sequelize = isTest
  ? new Sequelize({
      dialect: "sqlite",
      storage: ":memory:", // Forma soportada (sin advertencia)
      logging: false,
    })
  : new Sequelize(
      `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      {
        dialect: "postgres",
        logging: false,
      }
    );

// Objeto global para almacenar modelos
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
    const loadedModels = await loadModels(sequelize);
    Object.assign(models, loadedModels);

    defineRelations(models);

    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // en tests podrías usar force:true si querés limpio

    // Solo loguea si NO es test para no ensuciar la salida
    if (!isTest) {
      console.log("✅ Modelos sincronizados con la base de datos.");
      console.log("✅ Conexión a la base de datos establecida.");
    }
  } catch (err) {
    console.error("❌ Error inicializando base de datos:", err);
  }
};

export default initDatabase;
