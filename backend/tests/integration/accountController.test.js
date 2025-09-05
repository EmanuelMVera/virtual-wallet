import request from "supertest";
import app from "../../src/app.js";
import initDatabase, { sequelize } from "../../src/db/db.js";
import dotenv from "dotenv";
dotenv.config();
let token;
let resAlias;
let resCbu;
beforeAll(async () => {
    await initDatabase();
    await sequelize.sync({ force: true });
    const email = `test${Date.now()}@mail.com`;
    await request(app)
        .post("/api/users/register")
        .send({ name: "Test User", email, password: "password123" });
    const res = await request(app)
        .post("/api/users/login")
        .send({ email, password: "password123" });
    token = res.body.token;
    expect(token).toBeDefined();
    const resAcc = await request(app)
        .get("/api/accounts/account")
        .set("Authorization", `Bearer ${token}`);
    resAlias = resAcc.body.account.alias;
    resCbu = resAcc.body.account.cbu;
});
afterAll(async () => {
    await sequelize.close();
});
describe("Datos de la cuenta", () => {
    it("debe obtener los datos de la cuenta", async () => {
        const res = await request(app)
            .get("/api/accounts/account")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.account).toBeDefined();
        expect(res.body.account.alias).toBeDefined();
        expect(res.body.account.cbu).toBeDefined();
    });
    it("debe rechazar acceso sin token", async () => {
        const res = await request(app).get("/api/accounts/account");
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Usuario no autenticado.");
    });
});
describe("Busqueda de cuenta", () => {
    it("debe encontrar la cuenta por alias", async () => {
        const res = await request(app)
            .get("/api/accounts/find")
            .set("Authorization", `Bearer ${token}`)
            .query({ alias: resAlias });
        expect(res.status).toBe(200);
        expect(res.body.account).toBeDefined();
        expect(res.body.account.alias).toBe(resAlias);
    });
    it("debe encontrar la cuenta por cbu", async () => {
        const res = await request(app)
            .get("/api/accounts/find")
            .set("Authorization", `Bearer ${token}`)
            .query({ cbu: resCbu });
        expect(res.status).toBe(200);
        expect(res.body.account).toBeDefined();
        expect(res.body.account.cbu).toBe(resCbu);
    });
    it("debe devolver 404 si no existe la cuenta por alias", async () => {
        const res = await request(app)
            .get(`/api/accounts/find?alias=aliasinexistente`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Cuenta no encontrada.");
    });
    it("debe devolver 404 si no existe la cuenta por cbu", async () => {
        const res = await request(app)
            .get(`/api/accounts/find?cbu=cbusinexistente`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Cuenta no encontrada.");
    });
});
//# sourceMappingURL=accountController.test.js.map