/**
 * Verifica si un valor es un número positivo (acepta string o number).
 */
export function isPositiveNumber(value: string | number): boolean {
  const num = typeof value === "string" ? parseFloat(value) : Number(value);
  return !isNaN(num) && num > 0;
}
