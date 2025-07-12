function isPositiveAmount(amount: any): boolean {
  const num = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  return !isNaN(num) && num > 0;
}

describe("Validation Utils", () => {
  test("debe validar montos positivos", () => {
    expect(isPositiveAmount(10)).toBe(true);
    expect(isPositiveAmount("20.5")).toBe(true);
    expect(isPositiveAmount(-5)).toBe(false);
    expect(isPositiveAmount("abc")).toBe(false);
    expect(isPositiveAmount(0)).toBe(false);
  });
});
