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
describe("Flujo completo de usuario - Registro, banca y transacciones", () => {
    let token;
    let walletAccountId;
    let bankAccountId;
    const email = `e2e${Date.now()}@mail.com`;
    const password = "password123";
    it("registra un nuevo usuario correctamente", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({ name: "E2E User", email, password });
        expect(res.status).toBe(201);
    });
    it("inicia sesión y obtiene un token JWT", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({ email, password });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        token = res.body.token;
    });
    it("obtiene la cuenta virtual creada automáticamente", async () => {
        const res = await request(app)
            .get("/api/accounts/account")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        walletAccountId = res.body.account.id;
    });
    it("registra una cuenta bancaria ficticia para el usuario", async () => {
        const res = await request(app)
            .post("/api/bank-accounts/register")
            .set("Authorization", `Bearer ${token}`)
            .send({ bankName: "Banco E2E", accountNumber: `E2E${Date.now()}` });
        expect(res.status).toBe(201);
        bankAccountId = res.body.bankAccount.id;
    });
    it("realiza un depósito desde la cuenta bancaria hacia la billetera", async () => {
        const res = await request(app)
            .post("/api/bank-accounts/deposit")
            .set("Authorization", `Bearer ${token}`)
            .send({ bankAccountId, walletAccountId, amount: 200 });
        expect(res.status).toBe(200);
        expect(Number(res.body.walletAccount.balance)).toBeGreaterThanOrEqual(200);
    });
    it("consulta el balance actualizado de la cuenta virtual", async () => {
        const res = await request(app)
            .get("/api/accounts/account")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Number(res.body.account.balance ?? 0)).toBeGreaterThanOrEqual(200);
    });
    it("lista las transacciones realizadas por el usuario", async () => {
        const res = await request(app)
            .get("/api/transactions/list")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.transactions)).toBe(true);
        expect(res.body.transactions.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=userFlow.e2e.test.js.map