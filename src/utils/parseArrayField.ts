const parseArrayField = (field: string | undefined): string[] => {
  if (!field) return [];
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`Failed to parse array field: ${field}`);
    return [];
  }
};

export default parseArrayField;
