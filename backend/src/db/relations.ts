export const defineRelations = (models: Record<string, any>) => {
  Object.values(models).forEach((model) => {
    if (typeof model.associate === "function") {
      model.associate(models);
    }
  });

  console.log("✔ Relaciones entre modelos definidas.");
};
