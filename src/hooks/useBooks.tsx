import { useEffect, useState, useCallback, useMemo } from "react";
import type { Book, BookStatus } from "../types/Book";
import type { ErrorType } from "../types/Error";
import { getNextBookStatus } from "../constants/bookStatus";

import {
  getUserBooksData,
  addBook,
  deleteBook,
  updateBook,
} from "../services/booksService";
import { useUser } from "../hooks/useUser";

/**
 * Custom hook for managing books data and operations
 * 
 * @returns Object containing books data, loading state, error state, statistics, and CRUD operations
 * @example
 * ```tsx
 * const { books, loading, error, booksStats, handleBookSubmit } = useBooks();
 * ```
 */
export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ErrorType | null>(null);
  const userContext = useUser();
  const userId = userContext.user?.uid;

  const fetchBooks = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const userBooks = await getUserBooksData(userId);
      setBooks(userBooks);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setError(error as ErrorType);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleBookDelete = useCallback(async (bookId: string) => {
    try {
      setError(null);
      await deleteBook(bookId);
      setBooks(prevBooks => prevBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Failed to delete book:", error);
      setError(error as ErrorType);
    }
  }, []);

  const handleBookUpdate = useCallback(async (
    bookId: string,
    updatedData: Partial<Book>,
  ) => {
    try {
      setError(null);
      const result = await updateBook(bookId, updatedData);
      setBooks(prevBooks => 
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, ...updatedData } : book,
        )
      );
      return result;
    } catch (error) {
      console.error("Failed to update book:", error);
      setError(error as ErrorType);
      return false;
    }
  }, []);

  const handleStatusChange = useCallback(async (bookId: string, currentStatus: BookStatus) => {
    try {
      setError(null);
      const nextStatus = getNextBookStatus(currentStatus);
      await updateBook(bookId, { read: nextStatus });
      setBooks(prevBooks => 
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, read: nextStatus } : book,
        )
      );
    } catch (error) {
      console.error("Failed to update book status:", error);
      setError(error as ErrorType);
    }
  }, []);

  const handleBookSubmit = useCallback(async (book: import("../types/Book").BookFormData) => {
    if (!userId) {
      setError({ code: "VALIDATION_ERROR", message: "User not authenticated" });
      return false;
    }

    try {
      setError(null);
      const createdAt = new Date().toISOString();
      const newBookId = await addBook({
        ...book,
        userId: userId,
        createdAt: createdAt,
      });

      if (newBookId) {
        setBooks(prevBooks => [
          { ...book, id: newBookId, createdAt: createdAt },
          ...prevBooks,
        ]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add book:", error);
      setError(error as ErrorType);
      return false;
    }
  }, [userId]);

  // Memoized computed values
  const booksStats = useMemo(() => {
    const total = books.length;
    const read = books.filter(book => book.read === "Przeczytana").length;
    const inProgress = books.filter(book => book.read === "W trakcie").length;
    const dropped = books.filter(book => book.read === "Porzucona").length;
    
    return { total, read, inProgress, dropped };
  }, [books]);

  return {
    books,
    loading,
    error,
    booksStats,
    handleBookDelete,
    handleBookUpdate,
    handleStatusChange,
    handleBookSubmit,
    refetch: fetchBooks,
  };
};
