import { formatBalance } from "../../src/utils/formatUtils.js";

describe("Utils - Format", () => {
  it("debe formatear números como strings con 2 decimales", () => {
    expect(formatBalance(10)).toBe("10.00");
    expect(formatBalance(10.123)).toBe("10.12");
    expect(formatBalance(0)).toBe("0.00");
  });

  it("debe manejar valores negativos correctamente", () => {
    expect(formatBalance(-5.678)).toBe("-5.68");
  });
});
