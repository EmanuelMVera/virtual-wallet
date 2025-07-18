import request from "supertest";
import app from "../../src/app.js";
import initDatabase, { sequelize, models } from "../../src/db/db.js";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await initDatabase();
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Transferencia a sí mismo - Rechazo de operaciones inválidas", () => {
  let token: string;
  let accountId: number;

  const email = `self${Date.now()}@mail.com`;
  const password = "password123";

  it("registra y loguea un usuario para probar transferencias inválidas", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ name: "Self User", email, password });
    const res = await request(app)
      .post("/api/users/login")
      .send({ email, password });
    token = res.body.token;
  });

  it("obtiene la cuenta virtual creada y asigna saldo inicial", async () => {
    const resAcc = await request(app)
      .get("/api/accounts/account")
      .set("Authorization", `Bearer ${token}`);
    accountId = resAcc.body.account.id;
    await models.Account.update({ balance: 100 }, { where: { id: accountId } });
  });

  it("intenta transferirse a sí mismo y debe ser rechazado", async () => {
    const res = await request(app)
      .post("/api/transactions/transfer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        senderAccountId: accountId,
        receiverAccountId: accountId,
        amount: 10,
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/misma cuenta/i);
  });
});
