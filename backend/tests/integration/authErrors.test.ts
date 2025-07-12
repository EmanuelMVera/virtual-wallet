import request from "supertest";
import app from "../../src/app.js";

describe("Auth Middleware - Errores de autorización", () => {
  it("debe rechazar acceso a /api/accounts sin token", async () => {
    const res = await request(app).get("/api/accounts");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  it("debe rechazar creación de cuenta sin token", async () => {
    const res = await request(app).post("/api/accounts").send();
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  it("debe rechazar transferencia sin token", async () => {
    const res = await request(app).post("/api/transactions").send({
      senderAccountId: 1,
      receiverAccountId: 2,
      amount: 10,
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/not authorized/i);
  });
});
