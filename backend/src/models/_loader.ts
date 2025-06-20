import fs from "fs";
import path from "path";
import { Sequelize, ModelStatic } from "sequelize";
/**
 * Carga todos los modelos de Sequelize desde el directorio actual.
 * Los modelos deben exportar una función que recibe una instancia de Sequelize
 * y devuelve un modelo definido.
 *
 * @param sequelize - Instancia de Sequelize para la conexión a la base de datos.
 * @returns Un objeto con los modelos cargados.
 */
type ModelDefiner = (sequelize: Sequelize) => ModelStatic<any>;

const loadModels = async (sequelize: Sequelize) => {
  const models: Record<string, ModelStatic<any>> = {};
  const modelsDir = __dirname;

  const files = fs
    .readdirSync(modelsDir)
    .filter(
      (file) =>
        file.endsWith(".ts") &&
        !file.startsWith("_") &&
        !file.startsWith("index")
    );

  for (const file of files) {
    const { default: defineModel } = await import(path.join(modelsDir, file));
    const model = (defineModel as ModelDefiner)(sequelize);
    models[model.name] = model;
  }

  return models;
};

export default loadModels;
