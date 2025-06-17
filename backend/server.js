import { createServer } from "node:http";
import dotenv from "dotenv";
import app from "./app.js";

//Configurar dotenv para cargar las variables de entorno
dotenv.config();

//Acceder a las variables de entorno
const DB_HOST = process.env.DB_HOST;
const PORT = process.env.PORT;

const server = createServer((req, res) => {});

server.listen(PORT, DB_HOST, () => {
  console.log(`Server running at http://${DB_HOST}:${PORT}/`);
});
