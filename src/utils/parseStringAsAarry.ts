export const parseStringAsArray = (str: string): string => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed.join(", ") : str;
  } catch {
    return str;
  }
};
