import request from "supertest";
import app from "../../src/app.js";
import initDatabase, { sequelize } from "../../src/db/db.js";
import dotenv from "dotenv";
dotenv.config(); // Asegura que se usen las variables de entorno (ya usa `.env.test` si usás NODE_ENV=test)
beforeAll(async () => {
    await initDatabase();
    await sequelize.sync({ force: true }); // Limpia y prepara la base para los tests
});
afterAll(async () => {
    await sequelize.close(); // Cierra la conexión cuando termine todo
});
describe("Auth Middleware - Errores de autorización", () => {
    it("debe rechazar acceso a /api/accounts/list sin token", async () => {
        const res = await request(app).get("/api/accounts/list");
        expect(res.status).toBe(401);
        // expect(res.body.message).toMatch(/not authorized/i);
    });
    it("debe rechazar creación de cuenta sin token", async () => {
        const res = await request(app).post("/api/accounts/create").send();
        expect(res.status).toBe(401);
        // expect(res.body.message).toMatch(/not authorized/i);
    });
    it("debe rechazar transferencia sin token", async () => {
        const res = await request(app).post("/api/transactions/transfer").send({
            senderAccountId: 1,
            receiverAccountId: 2,
            amount: 10,
        });
        expect(res.status).toBe(401);
        // expect(res.body.message).toMatch(/not authorized/i);
    });
});
//# sourceMappingURL=authErrors.test.js.map