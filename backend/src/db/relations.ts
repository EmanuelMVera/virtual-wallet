/**
 * Define las relaciones entre los modelos de Sequelize.
 * Llama al método associate de cada modelo, si existe, pasando todos los modelos como argumento.
 * Esto permite que cada modelo configure sus relaciones (hasMany, belongsTo, etc.).
 * @param models Objeto con todos los modelos cargados
 */
export const defineRelations = (models: Record<string, any>) => {
  Object.values(models).forEach((model) => {
    if (typeof model.associate === "function") {
      model.associate(models);
    }
  });

  console.log("✔ Relaciones entre modelos definidas.");
};
