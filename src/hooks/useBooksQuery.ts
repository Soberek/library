import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import * as booksService from '../services/booksService';
import type { Book, BookStatus } from '../types/Book';
import { useMemo } from 'react';

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

// Query Key Factory
export const booksKeys = {
  all: ['books'] as const,
  lists: () => [...booksKeys.all, 'list'] as const,
  list: (userId: string) => [...booksKeys.lists(), userId] as const,
  details: () => [...booksKeys.all, 'detail'] as const,
  detail: (id: string) => [...booksKeys.details(), id] as const,
};

// Statistiken berechnen
const calculateStats = (books: Book[]): { booksStats: BooksStats; additionalStats: AdditionalStats } => {
  const total = books.length;
  const read = books.filter((book) => book.read === 'Przeczytana').length;
  const inProgress = books.filter((book) => book.read === 'W trakcie').length;
  const dropped = books.filter((book) => book.read === 'Porzucona').length;

  const totalRating = books.reduce((sum, book) => sum + (book.rating || 0), 0);
  const averageRating = total > 0 ? parseFloat((totalRating / total).toFixed(1)) : 0;

  const totalPages = books.reduce((sum, book) => sum + (book.overallPages || 0), 0);
  const readPages = books.reduce((sum, book) => sum + (book.readPages || 0), 0);
  const progressRate = totalPages > 0 ? parseFloat(((readPages / totalPages) * 100).toFixed(1)) : 0;
  const completionRate = total > 0 ? parseFloat(((readPages / totalPages) * 100).toFixed(1)) : 0;

  return {
    booksStats: { total, read, inProgress, dropped },
    additionalStats: { averageRating, totalPages, readPages, progressRate, completionRate },
  };
};

// Hook für Books Query
export const useBooksQuery = () => {
  const { user, loading: userLoading } = useAuth();
  const queryClient = useQueryClient();

  // Books Query
  const {
    data: books = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: booksKeys.list(user?.uid || ''),
    queryFn: () => booksService.getUserBooksData(user!.uid),
    enabled: !!user && !userLoading,
  });

  // Statistiken berechnen
  const stats = useMemo(() => calculateStats(books), [books]);

  // Add Book Mutation
  const addBookMutation = useMutation({
    mutationFn: (newBook: Book) => {
      if (!user) throw new Error('User not authenticated');
      const bookToAdd = { ...newBook, userId: user.uid, createdAt: new Date().toISOString() };
      return booksService.addBook(bookToAdd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: booksKeys.list(user?.uid || '') });
    },
  });

  // Update Book Mutation
  const updateBookMutation = useMutation({
    mutationFn: ({ bookId, updatedBook }: { bookId: string; updatedBook: Partial<Book> }) =>
      booksService.updateBook(bookId, updatedBook),
    onMutate: async ({ bookId, updatedBook }) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: booksKeys.list(user?.uid || '') });
      const previousBooks = queryClient.getQueryData<Book[]>(booksKeys.list(user?.uid || ''));
      
      queryClient.setQueryData<Book[]>(booksKeys.list(user?.uid || ''), (old = []) =>
        old.map((book) => (book.id === bookId ? { ...book, ...updatedBook } : book))
      );
      
      return { previousBooks };
    },
    onError: (err, variables, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData(booksKeys.list(user?.uid || ''), context.previousBooks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: booksKeys.list(user?.uid || '') });
    },
  });

  // Delete Book Mutation
  const deleteBookMutation = useMutation({
    mutationFn: (bookId: string) => booksService.deleteBook(bookId),
    onMutate: async (bookId) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: booksKeys.list(user?.uid || '') });
      const previousBooks = queryClient.getQueryData<Book[]>(booksKeys.list(user?.uid || ''));
      
      queryClient.setQueryData<Book[]>(booksKeys.list(user?.uid || ''), (old = []) =>
        old.filter((book) => book.id !== bookId)
      );
      
      return { previousBooks };
    },
    onError: (err, variables, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData(booksKeys.list(user?.uid || ''), context.previousBooks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: booksKeys.list(user?.uid || '') });
    },
  });

  // Toggle Favorite Mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ bookId, currentFavorite }: { bookId: string; currentFavorite: boolean }) =>
      booksService.updateBook(bookId, { isFavorite: !currentFavorite }),
    onMutate: async ({ bookId, currentFavorite }) => {
      await queryClient.cancelQueries({ queryKey: booksKeys.list(user?.uid || '') });
      const previousBooks = queryClient.getQueryData<Book[]>(booksKeys.list(user?.uid || ''));
      
      queryClient.setQueryData<Book[]>(booksKeys.list(user?.uid || ''), (old = []) =>
        old.map((book) => (book.id === bookId ? { ...book, isFavorite: !currentFavorite } : book))
      );
      
      return { previousBooks };
    },
    onError: (err, variables, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData(booksKeys.list(user?.uid || ''), context.previousBooks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: booksKeys.list(user?.uid || '') });
    },
  });

  // Status Change Helper
  const handleStatusChange = async (bookId: string, currentStatus: BookStatus) => {
    const newStatus: BookStatus = (() => {
      switch (currentStatus) {
        case 'Przeczytana': return 'Chcę przeczytać';
        case 'Porzucona': return 'Chcę przeczytać';
        case 'W trakcie': return 'Przeczytana';
        case 'Chcę przeczytać': return 'W trakcie';
        default: return 'Chcę przeczytać';
      }
    })();
    await updateBookMutation.mutateAsync({ bookId, updatedBook: { read: newStatus } });
  };

  // Rating Change Helper
  const handleRatingChange = async (bookId: string, newRating: number) => {
    await updateBookMutation.mutateAsync({ bookId, updatedBook: { rating: newRating } });
  };

  return {
    books,
    loading: isLoading || userLoading,
    error: error as Error | null,
    booksStats: stats.booksStats,
    additionalStats: stats.additionalStats,
    
    // Mutations
    handleBookAdd: (newBook: Book) => addBookMutation.mutateAsync(newBook),
    handleBookUpdate: (bookId: string, updatedBook: Partial<Book>) =>
      updateBookMutation.mutateAsync({ bookId, updatedBook }),
    handleBookDelete: (bookId: string) => deleteBookMutation.mutateAsync(bookId),
    handleToggleFavorite: (bookId: string, currentFavorite: boolean) =>
      toggleFavoriteMutation.mutateAsync({ bookId, currentFavorite }),
    handleStatusChange,
    handleRatingChange,
    
    // Mutation states
    isAdding: addBookMutation.isPending,
    isUpdating: updateBookMutation.isPending,
    isDeleting: deleteBookMutation.isPending,
  };
};

