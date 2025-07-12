import request from "supertest";
import app from "../../src/app.js";

describe("E2E - Transferencia entre dos usuarios distintos", () => {
  let tokenA: string, tokenB: string;
  let accountA: any, accountB: any;

  const emailA = `userA${Date.now()}@mail.com`;
  const emailB = `userB${Date.now()}@mail.com`;
  const password = "password123";

  it("Registra y loguea Usuario A", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ name: "User A", email: emailA, password });
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: emailA, password });
    tokenA = res.body.token;
  });

  it("Registra y loguea Usuario B", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ name: "User B", email: emailB, password });
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: emailB, password });
    tokenB = res.body.token;
  });

  it("Usuario A crea cuenta virtual y deposita saldo", async () => {
    const resAcc = await request(app)
      .post("/api/accounts")
      .set("Authorization", `Bearer ${tokenA}`);
    accountA = resAcc.body.account;

    // Simula depósito (ajusta según tu lógica, aquí se asume endpoint de depósito)
    await app
      .get("models")
      .Account.update({ balance: 200 }, { where: { id: accountA.id } });
  });

  it("Usuario B crea cuenta virtual", async () => {
    const resAcc = await request(app)
      .post("/api/accounts")
      .set("Authorization", `Bearer ${tokenB}`);
    accountB = resAcc.body.account;
  });

  it("Usuario A transfiere a Usuario B", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        senderAccountId: accountA.id,
        receiverAccountId: accountB.id,
        amount: 100,
      });
    expect(res.status).toBe(201);
    expect(res.body.transaction).toBeDefined();
  });

  it("Verifica balances de ambos usuarios", async () => {
    const resA = await request(app)
      .get("/api/accounts/balance")
      .set("Authorization", `Bearer ${tokenA}`);
    const resB = await request(app)
      .get("/api/accounts/balance")
      .set("Authorization", `Bearer ${tokenB}`);
    expect(Number(resA.body.balance)).toBe(100);
    expect(Number(resB.body.balance)).toBe(100);
  });
});
