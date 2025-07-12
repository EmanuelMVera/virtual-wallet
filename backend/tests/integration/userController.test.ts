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

describe("User Controller", () => {
  describe("POST /api/users/register", () => {
    it("debe rechazar registro con datos inválidos", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({ email: "noemail", password: "123" });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it("debe registrar un usuario con datos válidos", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          name: "Test User",
          email: `test_${Date.now()}_1@mail.com`,
          password: "password123",
        });
      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toContain("@mail.com");
    });
  });

  describe("POST /api/users/login", () => {
    it("debe rechazar login con datos inválidos", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "bad", password: "" });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });
});
