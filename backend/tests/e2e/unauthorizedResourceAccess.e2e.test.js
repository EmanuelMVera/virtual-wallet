import request from "supertest";
import app from "../../src/app.js";
import initDatabase, { sequelize } from "../../src/db/db.js";
beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await initDatabase();
    await sequelize.sync({ force: true });
});
afterAll(async () => {
    await sequelize.close();
});
describe("Acceso no autorizado entre usuarios - Prevención de transferencias indebidas", () => {
    let tokenA, tokenB;
    let accountA;
    const emailA = `owner${Date.now()}@mail.com`;
    const emailB = `intruder${Date.now()}@mail.com`;
    const password = "password123";
    it("registra y loguea al Usuario A (propietario)", async () => {
        await request(app)
            .post("/api/users/register")
            .send({ name: "Owner", email: emailA, password });
        const res = await request(app)
            .post("/api/users/login")
            .send({ email: emailA, password });
        tokenA = res.body.token;
    });
    it("registra y loguea al Usuario B (intruso)", async () => {
        await request(app)
            .post("/api/users/register")
            .send({ name: "Intruder", email: emailB, password });
        const res = await request(app)
            .post("/api/users/login")
            .send({ email: emailB, password });
        tokenB = res.body.token;
    });
    it("Usuario A obtiene su cuenta virtual creada por defecto", async () => {
        const resAcc = await request(app)
            .get("/api/accounts/account")
            .set("Authorization", `Bearer ${tokenA}`);
        accountA = resAcc.body.account;
    });
    it("Usuario B intenta transferir desde la cuenta de Usuario A y debe ser rechazado", async () => {
        const res = await request(app)
            .post("/api/transactions/transfer")
            .set("Authorization", `Bearer ${tokenB}`)
            .send({
            senderAccountId: accountA.id,
            receiverAccountId: accountA.id,
            amount: 10,
        });
        expect([400, 403]).toContain(res.status);
        expect(res.body.message.toLowerCase()).toMatch(/no autorizado|misma cuenta/);
    });
});
//# sourceMappingURL=unauthorizedResourceAccess.e2e.test.js.map