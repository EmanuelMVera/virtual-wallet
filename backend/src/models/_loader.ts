import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Sequelize, ModelStatic } from "sequelize";

/**
 * Tipo para funciones que definen modelos de Sequelize.
 */
type ModelDefiner = (sequelize: Sequelize) => ModelStatic<any>;

/**
 * Carga dinámicamente todos los modelos del directorio actual (excepto archivos que empiezan con "_" o "index").
 * @param sequelize Instancia de Sequelize
 * @returns Un objeto con los modelos cargados
 */
const loadModels = async (sequelize: Sequelize) => {
  const models: Record<string, ModelStatic<any>> = {};
  const __filename = fileURLToPath(import.meta.url);
  const modelsDir = path.dirname(__filename);

  // Detecta la extensión (.js o .ts) según el entorno
  const ext = path.extname(__filename);
  const files = fs
    .readdirSync(modelsDir)
    .filter(
      (file) =>
        file.endsWith(ext) && !file.startsWith("_") && !file.startsWith("index")
    );

  for (const file of files) {
    const fileUrl = pathToFileURL(path.join(modelsDir, file)).href;
    const { default: defineModel } = await import(fileUrl);
    const model = (defineModel as ModelDefiner)(sequelize);
    models[model.name] = model;
  }

  return models;
};

export default loadModels;
