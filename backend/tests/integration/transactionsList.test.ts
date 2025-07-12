import request from "supertest";
import app from "../../src/app.js";
import initDatabase, { sequelize } from "../../src/db/db.js";
import dotenv from "dotenv";

dotenv.config(); // Asegura que se usen las variables de entorno (ya usa `.env.test` si usás NODE_ENV=test)

beforeAll(async () => {
  await initDatabase();
  await sequelize.sync({ force: true }); // Limpia y prepara la base para los tests
});

afterAll(async () => {
  await sequelize.close(); // Cierra la conexión cuando termine todo
});

let token: string;

beforeAll(async () => {
  const email = `test${Date.now()}@mail.com`;
  await request(app)
    .post("/api/users/register")
    .send({ name: "Test User", email, password: "password123" });
  const res = await request(app)
    .post("/api/users/login")
    .send({ email, password: "password123" });
  token = res.body.token;
});

describe("Transactions List", () => {
  it("debe devolver un array de transacciones (puede estar vacío)", async () => {
    const res = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.transactions)).toBe(true);
  });

  it("debe rechazar si no está autenticado", async () => {
    const res = await request(app).get("/api/transactions");
    expect(res.status).toBe(401);
  });
});
