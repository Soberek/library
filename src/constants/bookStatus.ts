import type { BookStatus } from "../types/Book";

export const BOOK_STATUSES: readonly BookStatus[] = [
  "W trakcie",
  "Przeczytana", 
  "Porzucona"
] as const;

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  "W trakcie": "W trakcie",
  "Przeczytana": "Przeczytana",
  "Porzucona": "Porzucona",
} as const;

export const getNextBookStatus = (currentStatus: BookStatus): BookStatus => {
  const currentIndex = BOOK_STATUSES.indexOf(currentStatus);
  const nextIndex = (currentIndex + 1) % BOOK_STATUSES.length;
  return BOOK_STATUSES[nextIndex];
};
