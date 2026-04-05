import { Sequelize } from "sequelize";
import loadModels from "../models/_loader.js";
import { defineRelations } from "./relations.js";
import dotenv from "dotenv";

dotenv.config();
const isDev = process.env.NODE_ENV === "development";
const isInitScript = process.argv.includes("initDb.js");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

// Instancia de Sequelize según entorno
export const sequelize = new Sequelize({
      dialect: "postgres",
      host: DB_HOST,
      port: parseInt(DB_PORT || "5432", 10),
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      logging: isDev || isInitScript ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

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
    console.log("📂 Cargando modelos...");
    const loadedModels = await loadModels(sequelize);
    Object.assign(models, loadedModels);
    console.log(`✅ Se cargaron ${Object.keys(models).length} modelos: ${Object.keys(models).join(", ")}`);

    console.log("🔗 Definiendo relaciones entre modelos...");
    defineRelations(models);
    console.log("✅ Relaciones definidas correctamente.");

    console.log("🔌 Autenticando conexión a PostgreSQL...");
    await sequelize.authenticate();
    console.log("✅ Conexión autenticada.");

    console.log("🔄 Sincronizando modelos con la base de datos (alter: false)...");
    await sequelize.sync({ alter: false });
    console.log("✅ Modelos sincronizados con la base de datos.");
    console.log("✅ Base de datos inicializada correctamente.");
  } catch (err) {
    console.error("❌ Error crítico inicializando base de datos:", err);
    throw err; // Relanza el error para que el servidor no se levante
  }
};

export default initDatabase;
