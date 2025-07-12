import request from "supertest";
import app from "../../src/app.js";
import initDatabase, { sequelize } from "../../src/db/db.js";
import { models } from "../../src/db/db.js";
// import dotenv from "dotenv";

let token: string;
let senderAccountId: number;
let receiverAccountId: number;

beforeAll(async () => {
  await initDatabase();
  await sequelize.sync({ force: true });

  // Crear usuario 1 (receptor)
  const email1 = `test_${Date.now()}_1@mail.com`;
  const res1 = await request(app)
    .post("/api/users/register")
    .send({ name: "Receptor", email: email1, password: "123456" });
  const userId1 = res1.body.user.id;

  // Crear usuario 2 (emisor)
  const email2 = `test_${Date.now()}_2@mail.com`;
  await request(app)
    .post("/api/users/register")
    .send({ name: "Emisor", email: email2, password: "123456" });
  const resLogin = await request(app)
    .post("/api/users/login")
    .send({ email: email2, password: "123456" });
  token = resLogin.body.token;

  // Obtener cuentas
  const account1 = await models.Account.findOne({ where: { userId: userId1 } });
  const user2 = await models.User.findOne({ where: { email: email2 } });
  const account2 = await models.Account.findOne({
    where: { userId: user2.id },
  });

  if (!account1 || !account2) {
    throw new Error("No se pudieron obtener las cuentas.");
  }

  receiverAccountId = account1.id;
  senderAccountId = account2.id;

  // Cargar saldo en la cuenta del emisor
  await account2.update({ balance: 100.0 });
});

describe("Transaction Controller", () => {
  it("debe rechazar transferencias con saldo insuficiente", async () => {
    const res = await request(app)
      .post("/api/transactions/transfer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        senderAccountId,
        receiverAccountId,
        amount: 1000,
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Saldo insuficiente/);
  });

  it("debe realizar una transferencia exitosa", async () => {
    const res = await request(app)
      .post("/api/transactions/transfer")
      .set("Authorization", `Bearer ${token}`)
      .send({
        senderAccountId,
        receiverAccountId,
        amount: 50,
      });

    expect(res.status).toBe(201);
    expect(res.body.transaction).toBeDefined();
    expect(parseFloat(res.body.senderAccount.balance)).toBeCloseTo(50.0, 2);
    expect(parseFloat(res.body.receiverAccount.balance)).toBeCloseTo(50.0, 2);
  });
});

afterAll(async () => {
  console.log("Dialect usado en test:", sequelize.getDialect());
  await sequelize.close();
});
