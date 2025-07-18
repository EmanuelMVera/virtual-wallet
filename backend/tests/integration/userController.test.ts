import request from "supertest";
import app from "../../src/app.js";
import initDatabase, { sequelize, models } from "../../src/db/db.js";
import dotenv from "dotenv";
import { jest } from "@jest/globals";

dotenv.config();

let token: string = "";
const emailTest: string = `test${Date.now()}@mail.com`;
const passwordTest: string = "password123";

beforeAll(async () => {
  await initDatabase();
  await sequelize.sync({ force: true }); // Limpia y prepara la base para los tests
});

afterAll(async () => {
  await sequelize.close(); // Cierra la conexión cuando termine todo
});

describe("Registro de Usuario", () => {
  describe("POST /api/users/register", () => {
    it("debe rechazar registro con datos inválidos", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({ email: "noemail", password: "123" });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it("debe registrar un usuario con datos válidos", async () => {
      const res = await request(app).post("/api/users/register").send({
        name: "Test User",
        email: emailTest,
        password: passwordTest,
      });
      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toContain("@mail.com");
      expect(res.body.message).toBe("¡Usuario registrado exitosamente!");
    });

    it("debe rechazar registro con email ya existente", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({ name: "Test User", email: emailTest, password: passwordTest });
      expect(res.status).toBe(409);
      expect(res.body.message).toBe("Ya existe un usuario con este email.");
    });

    it("debe devolver 500 si ocurre un error inesperado en el registro", async () => {
      const spyUser = jest
        .spyOn(models.User, "create")
        .mockImplementation(() => {
          throw new Error("Error simulado");
        });

      const spyConsole = jest
        .spyOn(console, "error")
        .mockImplementation(() => {}); // silencia logs

      const res = await request(app)
        .post("/api/users/register")
        .send({
          name: "Test User",
          email: `error${Date.now()}@mail.com`,
          password: "password123",
        });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error del servidor durante el registro.");

      spyUser.mockRestore();
      spyConsole.mockRestore();
    });
  });
});

describe("Login de usuario", () => {
  describe("POST /api/users/login", () => {
    it("debe rechazar login con datos inválidos", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "bad", password: "" });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it("debe rechazar login con email no registrado", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "mailNoRegistrado@mail.com", password: "password123" });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Credenciales inválidas.");
    });

    it("debe rechazar login con contraseña incorrecta", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: emailTest, password: "wrongpassword" });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Contraseña inválida.");
    });

    it("debe iniciar sesión con datos válidos", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: emailTest, password: passwordTest });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.message).toBe("¡Inicio de sesión exitoso!");
      token = res.body.token;
    });
  });
});

describe("Logout de usuario", () => {
  describe("POST /api/users/logout", () => {
    /**
     * Nota: este endpoint no invalida el token en el servidor ni requiere verificación JWT.
     * Se utiliza únicamente para permitir que el frontend elimine manualmente el token.
     */
    it("debe cerrar sesión correctamente", async () => {
      const res = await request(app)
        .post("/api/users/logout")
        .set("Authorization", `Bearer ${token}`); // Simula flujo real, aunque no se use el token
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Sesión cerrada correctamente.");
    });
  });
});
