import request from "supertest";
import app from "../../src/app.js";

let token: string;
let bankAccountId: number;
let walletAccountId: number;

beforeAll(async () => {
  // Registra y loguea un usuario
  const email = `test${Date.now()}@mail.com`;
  await request(app)
    .post("/api/users/register")
    .send({ name: "Test User", email, password: "password123" });
  const res = await request(app)
    .post("/api/users/login")
    .send({ email, password: "password123" });
  token = res.body.token;

  // Crea una cuenta virtual
  const resAcc = await request(app)
    .post("/api/accounts")
    .set("Authorization", `Bearer ${token}`);
  walletAccountId = resAcc.body.account.id;
});

describe("BankAccount Controller", () => {
  it("debe registrar una cuenta bancaria", async () => {
    const res = await request(app)
      .post("/api/bank-accounts/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bankName: "Banco Ficticio",
        accountNumber: `ACC${Date.now()}`,
      });
    expect(res.status).toBe(201);
    expect(res.body.bankAccount).toBeDefined();
    bankAccountId = res.body.bankAccount.id;
  });

  it("debe realizar un depósito exitoso", async () => {
    const res = await request(app)
      .post("/api/bank-accounts/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bankAccountId,
        walletAccountId,
        amount: 100,
      });
    expect(res.status).toBe(200);
    expect(res.body.walletAccount.balance).toBeDefined();
  });
});
