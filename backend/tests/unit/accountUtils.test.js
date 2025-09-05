import { generateAlias, generateCbu } from "../../src/utils/accountUtils.js";
describe("Utils - Account", () => {
    describe("generateAlias", () => {
        it("debe generar alias con el formato correcto", () => {
            const alias = generateAlias("juan", "perez");
            expect(alias).toMatch(/^juan\.perez\.[a-z0-9]{4}\.vw$/);
        });
        it("debe generar alias únicos en múltiples llamadas", () => {
            const alias1 = generateAlias("ana", "gomez");
            const alias2 = generateAlias("ana", "gomez");
            expect(alias1).not.toBe(alias2);
        });
    });
    describe("generateCbu", () => {
        it("debe generar CBUs únicos en múltiples llamadas", () => {
            const cbu1 = generateCbu();
            const cbu2 = generateCbu();
            expect(cbu1).not.toBe(cbu2);
        });
        it("debe devolver un string numérico largo", () => {
            const cbu = generateCbu();
            expect(cbu).toMatch(/^\d{13,}$/);
        });
    });
});
//# sourceMappingURL=accountUtils.test.js.map