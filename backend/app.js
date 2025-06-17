import express from "express";

//Inicializar la aplicacion express
const app = express();

//Condiguraciones escensiales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
