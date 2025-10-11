import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useUser';
import * as booksService from '../services/booksService';
import type { Book, BookStatus } from '../types/Book';

interface BooksStats {
  total: number;
  read: number;
  inProgress: number;
  dropped: number;
}

interface AdditionalStats {
  averageRating: number;
  totalPages: number;
  readPages: number;
  progressRate: number;
  completionRate: number;
}

interface UseBooksReturn {
  books: Book[];
  loading: boolean;
  error: Error | null;
  booksStats: BooksStats;
  additionalStats: AdditionalStats;
  handleStatusChange: (bookId: string, newStatus: BookStatus) => Promise<void>;
  handleBookUpdate: (bookId: string, updatedBook: Partial<Book>) => Promise<void>;
  handleBookDelete: (bookId: string) => Promise<void>;
  handleBookAdd: (newBook: Book) => Promise<void>;
  handleToggleFavorite: (bookId: string, currentFavorite: boolean) => Promise<void>;
}

export const useBooks = (): UseBooksReturn => {
  const { user, loading: userLoading } = useUser();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [booksStats, setBooksStats] = useState<BooksStats>({
    total: 0, read: 0, inProgress: 0, dropped: 0,
  });
  const [additionalStats, setAdditionalStats] = useState<AdditionalStats>({
    averageRating: 0, totalPages: 0, readPages: 0, progressRate: 0, completionRate: 0,
  });

  const calculateStats = useCallback((currentBooks: Book[]) => {
    const total = currentBooks.length;
    const read = currentBooks.filter((book) => book.read === 'Przeczytana').length;
    const inProgress = currentBooks.filter((book) => book.read === 'W trakcie').length;
    const dropped = currentBooks.filter((book) => book.read === 'Porzucona').length;

    const totalRating = currentBooks.reduce((sum, book) => sum + (book.rating || 0), 0);
    const averageRating = total > 0 ? parseFloat((totalRating / total).toFixed(1)) : 0;

    const totalPages = currentBooks.reduce((sum, book) => sum + (book.overallPages || 0), 0);
    const readPages = currentBooks.reduce((sum, book) => sum + (book.readPages || 0), 0);
    const progressRate = totalPages > 0 ? parseFloat(((readPages / totalPages) * 100).toFixed(1)) : 0;
    const completionRate = total > 0 ? parseFloat(((readPages / totalPages) * 100).toFixed(1)) : 0; // Assuming total pages means overall progress

    setBooksStats({
      total, read, inProgress, dropped,
    });
    setAdditionalStats({
      averageRating, totalPages, readPages, progressRate, completionRate,
    });
  }, []);

  const fetchBooks = useCallback(async () => {
    if (!user || userLoading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await booksService.getUserBooksData(user.uid);
      setBooks(data);
      calculateStats(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user, userLoading, calculateStats]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleBookUpdate = useCallback(async (bookId: string, updatedBook: Partial<Book>) => {
    setLoading(true);
    setError(null);
    try {
      await booksService.updateBook(bookId, updatedBook);
      setBooks((prevBooks) => {
        const updated = prevBooks.map((book) =>
          book.id === bookId ? { ...book, ...updatedBook } : book,
        );
        calculateStats(updated);
        return updated;
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  const handleStatusChange = useCallback(async (bookId: string, currentStatus: BookStatus) => {
    const newStatus: BookStatus = (() => {
      switch (currentStatus) {
        case 'Chcę przeczytać': return 'W trakcie';
        case 'W trakcie': return 'Przeczytana';
        case 'Przeczytana': return 'Chcę przeczytać';
        case 'Porzucona': return 'Chcę przeczytać';
        default: return 'Chcę przeczytać';
      }
    })();
    await handleBookUpdate(bookId, { read: newStatus });
  }, [handleBookUpdate]);

  const handleBookDelete = useCallback(async (bookId: string) => {
    setLoading(true);
    setError(null);
    try {
      await booksService.deleteBook(bookId);
      setBooks((prevBooks) => {
        const updated = prevBooks.filter((book) => book.id !== bookId);
        calculateStats(updated);
        return updated;
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  const handleBookAdd = useCallback(async (newBook: Book) => {
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error('User not authenticated');
      const bookToAdd = { ...newBook, userId: user.uid, createdAt: new Date().toISOString() };
      const id = await booksService.addBook(bookToAdd);
      setBooks((prevBooks) => {
        const updated = [...prevBooks, { ...bookToAdd, id }];
        calculateStats(updated);
        return updated;
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user, calculateStats]);

  const handleToggleFavorite = useCallback(async (bookId: string, currentFavorite: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await booksService.updateBook(bookId, { isFavorite: !currentFavorite });
      setBooks((prevBooks) => {
        const updated = prevBooks.map((book) =>
          book.id === bookId ? { ...book, isFavorite: !currentFavorite } : book,
        );
        calculateStats(updated);
        return updated;
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  return {
    books, loading, error, booksStats, additionalStats,
    handleStatusChange, handleBookUpdate, handleBookDelete, handleBookAdd, handleToggleFavorite,
  };
};
