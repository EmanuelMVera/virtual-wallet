import request from "supertest";
import app from "../../src/app.js";

describe("E2E - Depósito con saldo insuficiente en cuenta bancaria", () => {
  let token: string;
  let bankAccountId: number;
  let walletAccountId: number;

  const email = `bank${Date.now()}@mail.com`;
  const password = "password123";

  it("Registra y loguea usuario", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ name: "Bank User", email, password });
    const res = await request(app)
      .post("/api/users/login")
      .send({ email, password });
    token = res.body.token;
  });

  it("Crea cuenta virtual", async () => {
    const resAcc = await request(app)
      .post("/api/accounts")
      .set("Authorization", `Bearer ${token}`);
    walletAccountId = resAcc.body.account.id;
  });

  it("Crea cuenta bancaria y simula saldo bajo", async () => {
    const resBank = await request(app)
      .post("/api/bank-accounts/register")
      .set("Authorization", `Bearer ${token}`)
      .send({ bankName: "Banco Test", accountNumber: `ACC${Date.now()}` });
    bankAccountId = resBank.body.bankAccount.id;
    // Simula saldo bajo
    await app
      .get("models")
      .BankAccount.update({ balance: 10 }, { where: { id: bankAccountId } });
  });

  it("Intenta depositar más de lo disponible y debe fallar", async () => {
    const res = await request(app)
      .post("/api/bank-accounts/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bankAccountId,
        walletAccountId,
        amount: 100,
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/insufficient bank account balance/i);
  });
});
