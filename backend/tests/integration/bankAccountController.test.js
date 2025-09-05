import request from "supertest";
import app from "../../src/app.js";
import initDatabase, { sequelize } from "../../src/db/db.js";
import dotenv from "dotenv";
dotenv.config();
let token;
let bankAccountId;
let walletAccountId;
beforeAll(async () => {
    await initDatabase();
    await sequelize.sync({ force: true });
    // Registra y loguea un usuario
    const email = `test${Date.now()}@mail.com`;
    await request(app)
        .post("/api/users/register")
        .send({ name: "Test User", email, password: "password123" });
    const res = await request(app)
        .post("/api/users/login")
        .send({ email, password: "password123" });
    token = res.body.token;
    // Obtiene el ID de la cuenta virtual del usuario
    const resAcc = await request(app)
        .get("/api/accounts/account")
        .set("Authorization", `Bearer ${token}`);
    walletAccountId = resAcc.body.account.id;
});
afterAll(async () => {
    await sequelize.close();
});
describe("Registro de cuenta bancaria", () => {
    it("debe registrar una cuenta bancaria con datos válidos", async () => {
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
    it("debe rechazar el registro si el usuario no está autenticado", async () => {
        const res = await request(app)
            .post("/api/bank-accounts/register")
            .send({ bankName: "Banco X", accountNumber: "123456789" });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Usuario no autenticado.");
    });
    it("debe rechazar el registro si los datos son inválidos", async () => {
        const res = await request(app)
            .post("/api/bank-accounts/register")
            .set("Authorization", `Bearer ${token}`)
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
    });
});
describe("Depósito desde cuenta bancaria a billetera", () => {
    it("debe realizar un depósito exitoso", async () => {
        const res = await request(app)
            .post("/api/bank-accounts/deposit")
            .set("Authorization", `Bearer ${token}`)
            .send({ bankAccountId, walletAccountId, amount: 100 });
        expect(res.status).toBe(200);
        expect(res.body.walletAccount.balance).toBeDefined();
    });
    it("debe rechazar el depósito si el usuario no está autenticado", async () => {
        const res = await request(app).post("/api/bank-accounts/deposit").send({
            bankAccountId,
            walletAccountId,
            amount: 50,
        });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Usuario no autenticado.");
    });
    it("debe rechazar el depósito si el saldo es insuficiente", async () => {
        const res = await request(app)
            .post("/api/bank-accounts/deposit")
            .set("Authorization", `Bearer ${token}`)
            .send({
            bankAccountId,
            walletAccountId,
            amount: 5000,
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Saldo insuficiente en la cuenta bancaria.");
    });
});
describe("Listado de cuentas bancarias del usuario", () => {
    it("debe listar las cuentas bancarias del usuario autenticado", async () => {
        const res = await request(app)
            .get("/api/bank-accounts/list")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.bankAccounts)).toBe(true);
    });
    it("debe rechazar el listado si el usuario no está autenticado", async () => {
        const res = await request(app).get("/api/bank-accounts/list");
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Usuario no autenticado.");
    });
});
//# sourceMappingURL=bankAccountController.test.js.map