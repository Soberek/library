/**
 * Returns the correct Polish plural form for "book"
 * 
 * @param count - Number of books
 * @returns Correct plural form in Polish
 * 
 * @example
 * ```ts
 * getBookCountText(1) // "książka"
 * getBookCountText(3) // "książki"
 * getBookCountText(5) // "książek"
 * ```
 */
export const getBookCountText = (count: number): string => {
  if (count === 1) return 'książka';
  if (count > 1 && count < 5) return 'książki';
  return 'książek';
};

/**
 * Formats a count with its plural form
 * 
 * @param count - Number to format
 * @returns Formatted string with count and plural form
 * 
 * @example
 * ```ts
 * formatBookCount(3) // "3 książki"
 * ```
 */
export const formatBookCount = (count: number): string => {
  return `${count} ${getBookCountText(count)}`;
};

