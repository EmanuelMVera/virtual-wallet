import request from "supertest";
import app from "../../src/app.js";

describe("Flujo E2E de usuario", () => {
  let token: string;
  let walletAccountId: number;
  let bankAccountId: number;

  const email = `e2e${Date.now()}@mail.com`;
  const password = "password123";

  it("debe registrar un usuario", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ name: "E2E User", email, password });
    expect(res.status).toBe(201);
  });

  it("debe loguear al usuario", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("debe crear una cuenta virtual", async () => {
    const res = await request(app)
      .post("/api/accounts")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(201);
    walletAccountId = res.body.account.id;
  });

  it("debe registrar una cuenta bancaria", async () => {
    const res = await request(app)
      .post("/api/bank-accounts/register")
      .set("Authorization", `Bearer ${token}`)
      .send({ bankName: "Banco E2E", accountNumber: `E2E${Date.now()}` });
    expect(res.status).toBe(201);
    bankAccountId = res.body.bankAccount.id;
  });

  it("debe depositar dinero en la billetera", async () => {
    const res = await request(app)
      .post("/api/bank-accounts/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({ bankAccountId, walletAccountId, amount: 200 });
    expect(res.status).toBe(200);
    expect(Number(res.body.walletAccount.balance)).toBeGreaterThanOrEqual(200);
  });

  it("debe consultar el balance de la cuenta virtual", async () => {
    const res = await request(app)
      .get("/api/accounts/balance")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Number(res.body.balance)).toBeGreaterThanOrEqual(200);
  });

  it("debe listar las transacciones del usuario", async () => {
    const res = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.transactions)).toBe(true);
    expect(res.body.transactions.length).toBeGreaterThan(0);
  });
});
