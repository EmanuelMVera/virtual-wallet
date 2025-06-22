import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Sequelize, ModelStatic } from "sequelize";

type ModelDefiner = (sequelize: Sequelize) => ModelStatic<any>;

const loadModels = async (sequelize: Sequelize) => {
  const models: Record<string, ModelStatic<any>> = {};
  const __filename = fileURLToPath(import.meta.url);
  const modelsDir = path.dirname(__filename);

  const ext = path.extname(__filename); // Detecta si estamos en .js o .ts
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
