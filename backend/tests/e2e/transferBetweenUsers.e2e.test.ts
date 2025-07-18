import request from "supertest";
import app from "../../src/app.js";
import initDatabase, { sequelize, models } from "../../src/db/db.js";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await initDatabase();
  await sequelize.sync({ force: true });
});

describe("Transferencia válida entre dos usuarios diferentes", () => {
  let tokenA: string, tokenB: string;
  let accountA: any, accountB: any;

  const emailA = `userA${Date.now()}@mail.com`;
  const emailB = `userB${Date.now()}@mail.com`;
  const password = "password123";

  it("registra y loguea al Usuario A (emisor)", async () => {
    const resRegister = await request(app)
      .post("/api/users/register")
      .send({ name: "User A", email: emailA, password });

    if (resRegister.status !== 201) {
      console.log("Error registrando Usuario A:", resRegister.body);
    }
    expect(resRegister.status).toBe(201);

    // const resLogin = await request(app)
    //   .post("/api/users/login")
    //   .send({ email: emailA, password });

    // if (!resLogin.body.token) {
    //   console.log("Error logueando Usuario A:", resLogin.body);
    // }
    // expect(resLogin.status).toBe(200);
    // tokenA = resLogin.body.token;

    // const resAccount = await request(app)
    //   .get("/api/accounts/account")
    //   .set("Authorization", `Bearer ${tokenA}`);

    // if (!resAccount.body.account) {
    //   console.log("Usuario A sin cuenta:", resAccount.body);
    // }
    // expect(resAccount.status).toBe(200);
    // expect(resAccount.body.account).toBeDefined();

    // accountA = resAccount.body.account;
    // expect(Number(accountA.balance)).toBeGreaterThanOrEqual(100);
  });

  // it("registra y loguea al Usuario B (receptor)", async () => {
  //   const resRegister = await request(app)
  //     .post("/api/users/register")
  //     .send({ name: "User B", email: emailB, password });

  //   if (resRegister.status !== 201) {
  //     console.log("Error registrando Usuario B:", resRegister.body);
  //   }
  //   expect(resRegister.status).toBe(201);

  //   const resLogin = await request(app)
  //     .post("/api/users/login")
  //     .send({ email: emailB, password });

  //   if (!resLogin.body.token) {
  //     console.log("Error logueando Usuario B:", resLogin.body);
  //   }
  //   expect(resLogin.status).toBe(200);
  //   tokenB = resLogin.body.token;

  //   const resAccount = await request(app)
  //     .get("/api/accounts/account")
  //     .set("Authorization", `Bearer ${tokenB}`);

  //   if (!resAccount.body.account) {
  //     console.log("Usuario B sin cuenta:", resAccount.body);
  //   }
  //   expect(resAccount.status).toBe(200);
  //   expect(resAccount.body.account).toBeDefined();

  //   accountB = resAccount.body.account;
  // });

  // it("Usuario A transfiere 100 a Usuario B exitosamente", async () => {
  //   const res = await request(app)
  //     .post("/api/transactions/transfer")
  //     .set("Authorization", `Bearer ${tokenA}`)
  //     .send({
  //       senderAccountId: accountA.id,
  //       receiverAccountId: accountB.id,
  //       amount: 100,
  //     });

  //   if (res.status !== 201) {
  //     console.log("Error en transferencia:", res.body);
  //   }
  //   expect(res.status).toBe(201);
  //   expect(res.body.transaction).toBeDefined();
  // });

  // it("verifica balances finales de ambos usuarios", async () => {
  //   const resA = await request(app)
  //     .get("/api/accounts/account")
  //     .set("Authorization", `Bearer ${tokenA}`);
  //   const resB = await request(app)
  //     .get("/api/accounts/account")
  //     .set("Authorization", `Bearer ${tokenB}`);

  //   if (!resA.body.account || !resB.body.account) {
  //     console.log("Error verificando balances:", {
  //       balanceA: resA.body,
  //       balanceB: resB.body,
  //     });
  //   }

  //   expect(resA.status).toBe(200);
  //   expect(resB.status).toBe(200);

  //   expect(Number(resA.body.account.balance)).toBe(0);
  //   expect(Number(resB.body.account.balance)).toBeGreaterThanOrEqual(100);
  // });
});

afterAll(async () => {
  await sequelize.close();
});
