import request from "supertest";
import app from "../../src/app.js";
import initDatabase, { sequelize, models } from "../../src/db/db.js";

let token: string;
let senderAccountId: number;
let receiverAccountId: number;

beforeAll(async () => {
  await initDatabase();
  await sequelize.sync({ force: true });

  const email1 = `test_${Date.now()}_1@mail.com`;
  const res1 = await request(app)
    .post("/api/users/register")
    .send({ name: "Receptor", email: email1, password: "123456" });
  const userId1 = res1.body.user.id;

  const email2 = `test_${Date.now()}_2@mail.com`;
  await request(app)
    .post("/api/users/register")
    .send({ name: "Emisor", email: email2, password: "123456" });

  const resLogin = await request(app)
    .post("/api/users/login")
    .send({ email: email2, password: "123456" });
  token = resLogin.body.token;

  const account1 = await models.Account.findOne({ where: { userId: userId1 } });
  const user2 = await models.User.findOne({ where: { email: email2 } });
  const account2 = await models.Account.findOne({
    where: { userId: user2!.id },
  });

  if (!account1 || !account2)
    throw new Error("No se pudieron obtener las cuentas.");

  receiverAccountId = account1.id;
  senderAccountId = account2.id;
});

describe("Transferencias entre cuentas virtuales", () => {
  it("debe rechazar la transferencia si el saldo es insuficiente", async () => {
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

  it("debe realizar una transferencia si los datos son válidos", async () => {
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
    expect(parseFloat(res.body.receiverAccount.balance)).toBeCloseTo(150.0, 2);
  });
});

describe("Listado de transacciones del usuario", () => {
  it("debe retornar todas las transacciones relacionadas al usuario", async () => {
    const res = await request(app)
      .get("/api/transactions/list")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.transactions)).toBe(true);
  });

  it("debe rechazar la solicitud si el usuario no está autenticado", async () => {
    const res = await request(app).get("/api/transactions/list");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/no autenticado/i);
  });
});

afterAll(async () => {
  await sequelize.close();
});
