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

describe("Depósito fallido por saldo insuficiente en cuenta bancaria", () => {
  let token: string;
  let bankAccountId: number;
  let walletAccountId: number;

  const email = `bank${Date.now()}@mail.com`;
  const password = "password123";

  it("registra y loguea usuario para depósito fallido", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ name: "Bank User", email, password });

    const res = await request(app)
      .post("/api/users/login")
      .send({ email, password });
    token = res.body.token;
  });

  it("obtiene la cuenta virtual creada para el usuario", async () => {
    const resAcc = await request(app)
      .get("/api/accounts/account")
      .set("Authorization", `Bearer ${token}`);
    walletAccountId = resAcc.body.account.id;
  });

  it("registra cuenta bancaria y reduce manualmente su saldo a 10", async () => {
    const resBank = await request(app)
      .post("/api/bank-accounts/register")
      .set("Authorization", `Bearer ${token}`)
      .send({ bankName: "Banco Test", accountNumber: `ACC${Date.now()}` });
    bankAccountId = resBank.body.bankAccount.id;

    // Ajusta el saldo manualmente
    await models.BankAccount.update(
      { balance: 10 },
      { where: { id: bankAccountId } }
    );
  });

  it("intenta depositar 100 con saldo insuficiente y debe fallar", async () => {
    const res = await request(app)
      .post("/api/bank-accounts/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bankAccountId,
        walletAccountId,
        amount: 100,
      });

    expect(res.status).toBe(400);
    expect(res.body.message.toLowerCase()).toMatch(
      /saldo insuficiente en la cuenta bancaria/
    );
  });
});
