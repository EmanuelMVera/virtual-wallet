import request from "supertest";
import app from "../../src/app.js";

let token: string;
let alias: string;
let cbu: string;

beforeAll(async () => {
  const email = `test${Date.now()}@mail.com`;
  await request(app)
    .post("/api/users/register")
    .send({ name: "Test User", email, password: "password123" });
  const res = await request(app)
    .post("/api/users/login")
    .send({ email, password: "password123" });
  token = res.body.token;

  // Crea una cuenta virtual y guarda alias/cbu
  const resAcc = await request(app)
    .post("/api/accounts")
    .set("Authorization", `Bearer ${token}`);
  alias = resAcc.body.account.alias;
  cbu = resAcc.body.account.cbu;
});

describe("Account Search", () => {
  it("debe encontrar cuenta por alias", async () => {
    const res = await request(app)
      .get(`/api/accounts/find?alias=${alias}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.account.alias).toBe(alias);
  });

  it("debe encontrar cuenta por cbu", async () => {
    const res = await request(app)
      .get(`/api/accounts/find?cbu=${cbu}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.account.cbu).toBe(cbu);
  });

  it("debe devolver 404 si no existe la cuenta", async () => {
    const res = await request(app)
      .get(`/api/accounts/find?alias=aliasinexistente`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
