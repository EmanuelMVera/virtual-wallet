import request from "supertest";
import app from "../../src/app.js";

describe("E2E - Transferencia a sí mismo (debe fallar)", () => {
  let token: string;
  let accountId: number;

  const email = `self${Date.now()}@mail.com`;
  const password = "password123";

  it("Registra y loguea usuario", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ name: "Self User", email, password });
    const res = await request(app)
      .post("/api/users/login")
      .send({ email, password });
    token = res.body.token;
  });

  it("Crea cuenta virtual y simula saldo", async () => {
    const resAcc = await request(app)
      .post("/api/accounts")
      .set("Authorization", `Bearer ${token}`);
    accountId = resAcc.body.account.id;
    await app
      .get("models")
      .Account.update({ balance: 100 }, { where: { id: accountId } });
  });

  it("Intenta transferir a sí mismo y debe fallar", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        senderAccountId: accountId,
        receiverAccountId: accountId,
        amount: 10,
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/cannot transfer to the same account/i);
  });
});
