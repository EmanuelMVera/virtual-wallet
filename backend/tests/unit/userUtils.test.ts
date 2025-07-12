import bcrypt from "bcryptjs";

// Simula una función utilitaria para hashear y comparar contraseñas
const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

describe("User Utils", () => {
  it("debe hashear y comparar correctamente la contraseña", async () => {
    const password = "supersecret";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    const isMatch = await comparePassword(password, hash);
    expect(isMatch).toBe(true);

    const isMatchWrong = await comparePassword("wrongpassword", hash);
    expect(isMatchWrong).toBe(false);
  });
});
