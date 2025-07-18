/**
 * Formatea un número como string con 2 decimales (para saldos).
 */
export function formatBalance(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toFixed(2);
}
