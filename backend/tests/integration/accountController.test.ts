import request from "supertest";
import app from "../../src/app.js";

let token: string;

beforeAll(async () => {
  // Registra y loguea un usuario para obtener token
  const email = `test${Date.now()}@mail.com`;
  await request(app)
    .post("/api/users/register")
    .send({ name: "Test User", email, password: "password123" });
  const res = await request(app)
    .post("/api/users/login")
    .send({ email, password: "password123" });
  token = res.body.token;
});

describe("Account Controller", () => {
  it("debe crear una nueva cuenta virtual", async () => {
    const res = await request(app)
      .post("/api/accounts")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(res.status).toBe(201);
    expect(res.body.account).toBeDefined();
    expect(res.body.account.alias).toBeDefined();
    expect(res.body.account.cbu).toBeDefined();
  });

  it("debe listar las cuentas virtuales del usuario", async () => {
    const res = await request(app)
      .get("/api/accounts")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.accounts)).toBe(true);
  });

  it("debe obtener el balance de la cuenta", async () => {
    const res = await request(app)
      .get("/api/accounts/balance")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404]).toContain(res.status); // Puede ser 404 si no hay cuenta
  });
});
