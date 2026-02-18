import { BOOK_STATUSES } from "../constants/bookStatus";
import type { Book, BookStatus } from "../types/Book";
import type { FilterState } from "../stores/filterStore";

/**
 * Filters books based on status
 */
export const filterByStatus = (
  books: Book[],
  status: BookStatus | "all",
): Book[] => {
  if (status === "all") return books;
  return books.filter((book) => book.read === status);
};

/**
 * Filters books based on genre
 */
export const filterByGenre = (books: Book[], genre: string): Book[] => {
  if (genre === "all") return books;
  return books.filter((book) => book.genre === genre);
};

/**
 * Filters books based on rating range
 */
export const filterByRating = (
  books: Book[],
  ratingRange: [number, number],
): Book[] => {
  return books.filter(
    (book) => book.rating >= ratingRange[0] && book.rating <= ratingRange[1],
  );
};

/**
 * Filters books based on page count range
 */
export const filterByPages = (
  books: Book[],
  pagesRange: [number, number],
): Book[] => {
  return books.filter(
    (book) =>
      book.overallPages >= pagesRange[0] && book.overallPages <= pagesRange[1],
  );
};

/**
 * Filters books to show only favorites
 */
export const filterByFavorites = (
  books: Book[],
  showOnlyFavorites: boolean,
): Book[] => {
  if (!showOnlyFavorites) return books;
  return books.filter((book) => book.isFavorite === true);
};

/**
 * Filters books based on author name (case-insensitive)
 */
export const filterByAuthor = (books: Book[], author: string): Book[] => {
  if (!author.trim()) return books;
  const searchAuthor = author.toLowerCase();
  return books.filter((book) =>
    book.author.toLowerCase().includes(searchAuthor),
  );
};

/**
 * Filters books based on search term (searches in title and author, case-insensitive)
 */
export const filterBySearchTerm = (
  books: Book[],
  searchTerm: string,
): Book[] => {
  if (!searchTerm.trim()) return books;
  const term = searchTerm.toLowerCase();
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term),
  );
};

/**
 * Comparison function for sorting by title
 */
const compareByTitle = (a: Book, b: Book, order: "asc" | "desc"): number => {
  const aValue = a.title.toLowerCase();
  const bValue = b.title.toLowerCase();
  return order === "asc"
    ? aValue > bValue
      ? 1
      : -1
    : aValue < bValue
      ? 1
      : -1;
};

/**
 * Comparison function for sorting by author
 */
const compareByAuthor = (a: Book, b: Book, order: "asc" | "desc"): number => {
  const aValue = a.author.toLowerCase();
  const bValue = b.author.toLowerCase();
  return order === "asc"
    ? aValue > bValue
      ? 1
      : -1
    : aValue < bValue
      ? 1
      : -1;
};

/**
 * Comparison function for sorting by rating
 */
const compareByRating = (a: Book, b: Book, order: "asc" | "desc"): number => {
  const aValue = a.rating;
  const bValue = b.rating;
  return order === "asc"
    ? aValue > bValue
      ? 1
      : -1
    : aValue < bValue
      ? 1
      : -1;
};

/**
 * Comparison function for sorting by page count
 */
const compareByPages = (a: Book, b: Book, order: "asc" | "desc"): number => {
  const aValue = a.overallPages;
  const bValue = b.overallPages;
  return order === "asc"
    ? aValue > bValue
      ? 1
      : -1
    : aValue < bValue
      ? 1
      : -1;
};

/**
 * Comparison function for sorting by date added
 */
const compareByDateAdded = (
  a: Book,
  b: Book,
  order: "asc" | "desc",
): number => {
  const aValue = new Date(a.createdAt || 0).getTime();
  const bValue = new Date(b.createdAt || 0).getTime();
  return order === "asc"
    ? aValue > bValue
      ? 1
      : -1
    : aValue < bValue
      ? 1
      : -1;
};

/**
 * Comparison function for sorting by status
 */
const compareByStatus = (a: Book, b: Book, order: "asc" | "desc"): number => {
  const aStatusIndex = BOOK_STATUSES.indexOf(a.read as BookStatus);
  const bStatusIndex = BOOK_STATUSES.indexOf(b.read as BookStatus);
  return order === "asc"
    ? aStatusIndex - bStatusIndex
    : bStatusIndex - aStatusIndex;
};

/**
 * Sorts books based on the specified criteria
 */
export const sortBooks = (
  books: Book[],
  sortBy: FilterState["sortBy"],
  sortOrder: "asc" | "desc",
): Book[] => {
  const sorted = [...books];

  sorted.sort((a, b) => {
    switch (sortBy) {
      case "title":
        return compareByTitle(a, b, sortOrder);
      case "author":
        return compareByAuthor(a, b, sortOrder);
      case "rating":
        return compareByRating(a, b, sortOrder);
      case "pages":
        return compareByPages(a, b, sortOrder);
      case "dateAdded":
        return compareByDateAdded(a, b, sortOrder);
      case "status":
        return compareByStatus(a, b, sortOrder);
      default:
        return 0;
    }
  });

  return sorted;
};

/**
 * Applies all filters and sorting to a list of books
 */
export const applyFiltersAndSort = (
  books: Book[],
  filters: FilterState,
): Book[] => {
  let filtered = [...books];

  // Apply search filter first (highest priority)
  filtered = filterBySearchTerm(filtered, filters.searchTerm);

  // Apply filters in sequence
  filtered = filterByStatus(filtered, filters.status);
  filtered = filterByGenre(filtered, filters.genre);
  filtered = filterByRating(filtered, filters.ratingRange);
  filtered = filterByPages(filtered, filters.pagesRange);
  filtered = filterByFavorites(filtered, filters.showOnlyFavorites);
  filtered = filterByAuthor(filtered, filters.author);

  // Apply sorting
  filtered = sortBooks(filtered, filters.sortBy, filters.sortOrder);

  return filtered;
};
