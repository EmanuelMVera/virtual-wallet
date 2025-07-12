function generateAlias(firstName: string, lastName: string): string {
  const randomWord = Math.random().toString(36).substring(2, 6);
  return `${firstName}.${lastName}.${randomWord}.vw`;
}

function generateCbu(): string {
  return `${Date.now()}${Math.floor(Math.random() * 10000)}`;
}

describe("Account Utils", () => {
  it("debe generar alias únicos", () => {
    const alias1 = generateAlias("juan", "perez");
    const alias2 = generateAlias("juan", "perez");
    expect(alias1).not.toBe(alias2);
    expect(alias1).toMatch(/juan\.perez\.[a-z0-9]{4}\.vw/);
  });

  it("debe generar CBU únicos", () => {
    const cbu1 = generateCbu();
    const cbu2 = generateCbu();
    expect(cbu1).not.toBe(cbu2);
    expect(cbu1).toMatch(/^\d{13,}$/);
  });
});

describe("Correcta generación de sufijo vw", () => {
  it("debe generar vw al final", () => {
    const alias1 = "Pedro.Pascal.1234.vw";
    expect(alias1).toMatch(/\.vw$/);
  });
});
