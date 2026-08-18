import { GENRES } from "../constants/genres";

/**
 * Returns the correct Polish plural form for "book"
 * 
 * @param count - Number of books
 * @returns Correct plural form in Polish
 */
export const getBookCountText = (count: number): string => {
  if (count === 1) return 'książka';
  if (count > 1 && count < 5) return 'książki';
  return 'książek';
};

/**
 * Formats a count with its plural form
 */
export const formatBookCount = (count: number): string => {
  return `${count} ${getBookCountText(count)}`;
};

/**
 * Formats genre key/string into human-readable Polish genre name
 * E.g. "POWIESC_FANTASY" -> "Powieść fantasy", "AUTOBIOGRAFIA" -> "Autobiografia"
 */
export const formatGenre = (genre?: string): string => {
  if (!genre) return '';
  const trimmed = genre.trim();
  const lowerKey = trimmed.toLowerCase();
  
  if (GENRES[lowerKey]) {
    const name = GENRES[lowerKey];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Replace underscores and format title
  const cleaned = trimmed.replace(/_/g, ' ').toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};
