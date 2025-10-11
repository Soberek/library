import { VALIDATION_RULES } from '../constants/validation';

/**
 * Validates if a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates if a number is within the specified range
 */
export const isInRange = (
  value: number,
  min: number,
  max: number,
): boolean => {
  return value >= min && value <= max;
};

/**
 * Validates book title
 */
export const validateBookTitle = (title: string): string | null => {
  if (!title || title.trim().length === 0) {
    return 'Tytuł jest wymagany';
  }
  if (title.length > VALIDATION_RULES.BOOK.TITLE.MAX_LENGTH) {
    return `Tytuł nie może być dłuższy niż ${VALIDATION_RULES.BOOK.TITLE.MAX_LENGTH} znaków`;
  }
  return null;
};

/**
 * Validates book author
 */
export const validateBookAuthor = (author: string): string | null => {
  if (!author || author.trim().length === 0) {
    return 'Autor jest wymagany';
  }
  if (author.length > VALIDATION_RULES.BOOK.AUTHOR.MAX_LENGTH) {
    return `Autor nie może być dłuższy niż ${VALIDATION_RULES.BOOK.AUTHOR.MAX_LENGTH} znaków`;
  }
  return null;
};

/**
 * Validates book pages
 */
export const validateBookPages = (pages: number): string | null => {
  if (!isInRange(pages, VALIDATION_RULES.BOOK.PAGES.MIN, VALIDATION_RULES.BOOK.PAGES.MAX)) {
    return `Liczba stron musi być między ${VALIDATION_RULES.BOOK.PAGES.MIN} a ${VALIDATION_RULES.BOOK.PAGES.MAX}`;
  }
  return null;
};

/**
 * Validates book rating
 */
export const validateBookRating = (rating: number): string | null => {
  if (!isInRange(rating, VALIDATION_RULES.BOOK.RATING.MIN, VALIDATION_RULES.BOOK.RATING.MAX)) {
    return `Ocena musi być między ${VALIDATION_RULES.BOOK.RATING.MIN} a ${VALIDATION_RULES.BOOK.RATING.MAX}`;
  }
  return null;
};

/**
 * Validates cover URL
 */
export const validateCoverUrl = (url: string): string | null => {
  if (!url || url.trim().length === 0) {
    return null; // Cover URL is optional
  }
  if (url.length > VALIDATION_RULES.BOOK.COVER_URL.MAX_LENGTH) {
    return `URL okładki nie może być dłuższy niż ${VALIDATION_RULES.BOOK.COVER_URL.MAX_LENGTH} znaków`;
  }
  if (!isValidUrl(url)) {
    return 'Nieprawidłowy URL';
  }
  return null;
};
