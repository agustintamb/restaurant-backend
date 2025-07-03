/**
 * Convierte un texto a formato slug (snake_case)
 * @param text - Texto a convertir
 * @returns Texto en formato slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales excepto espacios y guiones
    .replace(/[\s_-]+/g, '_') // Reemplazar espacios, guiones y guiones bajos múltiples con un solo guion bajo
    .replace(/^_+|_+$/g, ''); // Remover guiones bajos al inicio y final
};

/**
 * Verifica si un slug es válido
 * @param slug - Slug a validar
 * @returns true si el slug es válido
 */
export const isValidSlug = (slug: string): boolean => {
  const slugPattern = /^[a-z0-9_]+$/;
  return slugPattern.test(slug) && slug.length > 0;
};
