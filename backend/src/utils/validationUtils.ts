/**
 * Función auxiliar para validar números positivos.
 */
export function isPositiveNumber(value: string | number): boolean {
  const num = typeof value === "string" ? parseFloat(value) : Number(value);
  return !isNaN(num) && num > 0;
}
