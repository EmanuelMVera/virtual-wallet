import request from "supertest";
import app from "../../src/app.js";

describe("E2E - Acceso no autorizado a recursos de otro usuario", () => {
  let tokenA: string, tokenB: string;
  let accountA: any;

  const emailA = `owner${Date.now()}@mail.com`;
  const emailB = `intruder${Date.now()}@mail.com`;
  const password = "password123";

  it("Registra y loguea Usuario A", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ name: "Owner", email: emailA, password });
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: emailA, password });
    tokenA = res.body.token;
  });

  it("Registra y loguea Usuario B", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ name: "Intruder", email: emailB, password });
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: emailB, password });
    tokenB = res.body.token;
  });

  it("Usuario A crea cuenta virtual", async () => {
    const resAcc = await request(app)
      .post("/api/accounts")
      .set("Authorization", `Bearer ${tokenA}`);
    accountA = resAcc.body.account;
  });

  it("Usuario B intenta transferir desde la cuenta de Usuario A y debe fallar", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        senderAccountId: accountA.id,
        receiverAccountId: accountA.id,
        amount: 10,
      });
    expect([400, 403]).toContain(res.status);
    expect(res.body.message.toLowerCase()).toMatch(
      /not authorized|cannot transfer to the same account/
    );
  });
});
