import request from "supertest";
import app from "../../src/app.js";
import initDatabase, { sequelize } from "../../src/db/db.js";
import dotenv from "dotenv";

dotenv.config(); // Asegura que se usen las variables de entorno (ya usa `.env.test` si usás NODE_ENV=test)
let token: string;

beforeAll(async () => {
  await initDatabase();
  await sequelize.sync({ force: true }); // Limpia y prepara la base para los tests

  // Crear usuario
  const email = `test_${Date.now()}_2@mail.com`;
  await request(app)
    .post("/api/users/register")
    .send({ name: "User", email: email, password: "123456" });
  const resLogin = await request(app)
    .post("/api/users/login")
    .send({ email: email, password: "123456" });
  token = resLogin.body.token;
});

afterAll(async () => {
  await sequelize.close(); // Cierra la conexión cuando termine todo
});

describe("User Logout", () => {
  it("debe devolver mensaje de logout exitoso", async () => {
    const res = await request(app)
      .post("/api/users/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(
      /Sesión cerrada correctamente. Por favor elimina tu token en el cliente./
    );
  });
});
