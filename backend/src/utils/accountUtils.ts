/**
 * Genera un alias único con un sufijo aleatorio de 4 caracteres.
 * Ejemplo: "juan.perez.ab12.vw"
 */
export function generateAlias(firstName: string, lastName: string): string {
  const randomWord = Math.random().toString(36).substring(2, 6);
  return `${firstName}.${lastName}.${randomWord}.vw`;
}

/**
 * Genera un CBU único usando timestamp + número aleatorio.
 */
export function generateCbu(): string {
  return `${Date.now()}${Math.floor(Math.random() * 10000)}`;
}
