import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import * as booksService from '../services/booksService';
import type { Book, BookStatus } from '../types/Book';
import { useMemo, useState } from 'react';
import type { PaginatedResult } from '../services/booksService';
import { QueryDocumentSnapshot, type DocumentData } from 'firebase/firestore';

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
  paginatedList: (userId: string, sortField: string, sortDirection: 'asc' | 'desc') => 
    [...booksKeys.lists(), userId, 'paginated', sortField, sortDirection] as const,
  details: () => [...booksKeys.all, 'detail'] as const,
  detail: (id: string) => [...booksKeys.details(), id] as const,
};

// Statistiken berechnen
const calculateStats = (books: Book[]): { booksStats: BooksStats; additionalStats: AdditionalStats } => {
  const total = books.length;
  const read = books.filter((book) => book.read === 'Przeczytana').length;
  const inProgress = books.filter((book) => book.read === 'W trakcie').length;
  const dropped = books.filter((book) => book.read === 'Porzucona').length;

  const totalRating = books.reduce((sum, book) => sum + (Number(book.rating) || 0), 0);
  const averageRating = total > 0 ? parseFloat((totalRating / total).toFixed(1)) : 0;

  const totalPages = books.reduce((sum, book) => sum + (Number(book.overallPages) || 0), 0);
  const readPages = books.reduce((sum, book) => sum + (Number(book.readPages) || 0), 0);
  const progressRate = totalPages > 0 ? parseFloat(((readPages / totalPages) * 100).toFixed(1)) : 0;
  const completionRate = total > 0 ? parseFloat(((read / total) * 100).toFixed(1)) : 0;

  return {
    booksStats: { total, read, inProgress, dropped },
    additionalStats: { averageRating, totalPages, readPages, progressRate, completionRate },
  };
};

// Hook für Books Query
export const useBooksQuery = (usePagination = true, pageSize = 12) => {
  const { user, loading: userLoading } = useAuth();
  const queryClient = useQueryClient();
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // State to track if we should fall back to non-paginated query
  const [useFallback, setUseFallback] = useState(false);

  // Paginated Books Query
  const infiniteQuery = useInfiniteQuery({
    queryKey: booksKeys.paginatedList(user?.uid || '', sortField, sortDirection),
    queryFn: async ({ pageParam }) => {
      if (useFallback) {
        throw new Error('Using fallback query instead');
      }
      
      try {
        return await booksService.getUserBooksDataPaginated(
          user!.uid,
          pageSize,
          pageParam as QueryDocumentSnapshot<DocumentData> | null,
          sortField,
          sortDirection
        );
      } catch (error) {
        console.error('Błąd pobierania paginowanych książek:', error);
        
        // If there's an error with the specified sort field, try with default sort
        if (sortField !== 'createdAt' && error instanceof Error && error.toString().includes('index')) {
          console.log('Przełączanie na domyślne pole sortowania');
          setSortField('createdAt');
          try {
            return await booksService.getUserBooksDataPaginated(
              user!.uid,
              pageSize,
              pageParam as QueryDocumentSnapshot<DocumentData> | null,
              'createdAt',
              sortDirection
            );
          } catch (innerError) {
            console.error('Error with fallback sort field:', innerError);
            // If even the fallback fails, switch to non-paginated mode
            setUseFallback(true);
            throw innerError;
          }
        }
        
        // For persistent errors, switch to non-paginated mode
        if (error instanceof Error && 
            (error.toString().includes('permission') || 
             error.toString().includes('exist') ||
             error.toString().includes('unavailable'))) {
          console.log('Przełączanie na tryb niepaginowany z powodu trwałego błędu');
          setUseFallback(true);
        }
        
        throw error;
      }
    },
    initialPageParam: null as QueryDocumentSnapshot<DocumentData> | null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.lastDoc : undefined,
    enabled: !!user && !userLoading && usePagination && !useFallback,
    retry: 1, // Limit retries to avoid excessive error logs
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't auto-refetch when window regains focus
  });

  // Legacy non-paginated query (for backward compatibility or fallback)
  const legacyQuery = useQuery({
    queryKey: booksKeys.list(user?.uid || ''),
    queryFn: () => booksService.getUserBooksData(user!.uid),
    enabled: !!user && !userLoading && (!usePagination || useFallback),
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't auto-refetch when window regains focus
  });

  // Combine all books from paginated results
  // React Query already handles deduplication, so we just flatten the pages
  const paginatedBooks = useMemo(() => {
    if (!infiniteQuery.data) return [];
    return infiniteQuery.data.pages.flatMap(page => page.items);
  }, [infiniteQuery.data]);

  // Use either paginated or legacy books
  const books = useMemo(() => {
    return (usePagination && !useFallback) ? paginatedBooks : (legacyQuery.data || []);
  }, [usePagination, useFallback, paginatedBooks, legacyQuery.data]);

  // Loading state from either query
  const isLoading = (usePagination && !useFallback) ? infiniteQuery.isLoading : legacyQuery.isLoading;
  
  // Error handling with better error messages
  let error = (usePagination && !useFallback) ? infiniteQuery.error : legacyQuery.error;
  
  // Provide more specific error message for Firebase index issues
  if (error && error.toString().includes('index')) {
    error = new Error('Wystąpił błąd z indeksem Firebase. Proszę skontaktować się z administratorem.');
  } else if (error) {
    error = new Error('Błąd pobierania paginowanych książek.');
  }

  // Pagination status
  const hasNextPage = !useFallback && infiniteQuery.hasNextPage || false;
  const isFetchingNextPage = !useFallback && infiniteQuery.isFetchingNextPage;
  const fetchNextPage = !useFallback ? infiniteQuery.fetchNextPage : () => Promise.resolve();

  // Statistiken berechnen
  const stats = useMemo(() => calculateStats(books), [books]);

  // Add Book Mutation
  const addBookMutation = useMutation({
    mutationFn: (newBook: Book) => {
      if (!user) throw new Error('User not authenticated');
      const bookToAdd = { ...newBook, userId: user.uid, createdAt: new Date().toISOString() };
      return booksService.addBook(bookToAdd);
    },
    onSettled: () => {
      // Invalidate the correct query key based on current mode
      const queryKey = (usePagination && !useFallback)
        ? booksKeys.paginatedList(user?.uid || '', sortField, sortDirection)
        : booksKeys.list(user?.uid || '');
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Update Book Mutation
  const updateBookMutation = useMutation({
    mutationFn: ({ bookId, updatedBook }: { bookId: string; updatedBook: Partial<Book> }) =>
      booksService.updateBook(bookId, updatedBook),
    onMutate: async ({ bookId, updatedBook }) => {
      if (usePagination && !useFallback) {
        // Optimistic update for paginated data
        await queryClient.cancelQueries({ 
          queryKey: booksKeys.paginatedList(user?.uid || '', sortField, sortDirection) 
        });
        
        const previousData = queryClient.getQueryData(
          booksKeys.paginatedList(user?.uid || '', sortField, sortDirection)
        );
        
        queryClient.setQueryData(
          booksKeys.paginatedList(user?.uid || '', sortField, sortDirection),
          (old: any) => {
            if (!old) return old;
            
            return {
              ...old,
              pages: old.pages.map((page: PaginatedResult<Book>) => ({
                ...page,
                items: page.items.map((book: Book) => 
                  book.id === bookId ? { ...book, ...updatedBook } : book
                )
              }))
            };
          }
        );
        
        return { previousData };
      } else {
        // Legacy optimistic update
        await queryClient.cancelQueries({ queryKey: booksKeys.list(user?.uid || '') });
        const previousBooks = queryClient.getQueryData<Book[]>(booksKeys.list(user?.uid || ''));
        
        queryClient.setQueryData<Book[]>(booksKeys.list(user?.uid || ''), (old = []) =>
          old.map((book) => (book.id === bookId ? { ...book, ...updatedBook } : book))
        );
        
        return { previousBooks };
      }
    },
    onError: (_err, _variables, context) => {
      // Rollback to previous state on error
      if (usePagination && !useFallback && context?.previousData) {
        queryClient.setQueryData(
          booksKeys.paginatedList(user?.uid || '', sortField, sortDirection),
          context.previousData
        );
      } else if ((!usePagination || useFallback) && context?.previousBooks) {
        queryClient.setQueryData(
          booksKeys.list(user?.uid || ''),
          context.previousBooks
        );
      }
    },
    onSettled: () => {
      // Invalidate the correct query key based on current mode
      const queryKey = (usePagination && !useFallback)
        ? booksKeys.paginatedList(user?.uid || '', sortField, sortDirection)
        : booksKeys.list(user?.uid || '');
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Delete Book Mutation
  const deleteBookMutation = useMutation({
    mutationFn: (bookId: string) => booksService.deleteBook(bookId),
    onMutate: async (bookId) => {
      if (usePagination && !useFallback) {
        // Optimistic update for paginated data
        await queryClient.cancelQueries({ 
          queryKey: booksKeys.paginatedList(user?.uid || '', sortField, sortDirection) 
        });
        
        const previousData = queryClient.getQueryData(
          booksKeys.paginatedList(user?.uid || '', sortField, sortDirection)
        );
        
        queryClient.setQueryData(
          booksKeys.paginatedList(user?.uid || '', sortField, sortDirection),
          (old: any) => {
            if (!old) return old;
            
            return {
              ...old,
              pages: old.pages.map((page: PaginatedResult<Book>) => ({
                ...page,
                items: page.items.filter((book: Book) => book.id !== bookId)
              }))
            };
          }
        );
        
        return { previousData };
      } else {
        // Legacy optimistic update
        await queryClient.cancelQueries({ queryKey: booksKeys.list(user?.uid || '') });
        const previousBooks = queryClient.getQueryData<Book[]>(booksKeys.list(user?.uid || ''));
        
        queryClient.setQueryData<Book[]>(booksKeys.list(user?.uid || ''), (old = []) =>
          old.filter((book) => book.id !== bookId)
        );
        
        return { previousBooks };
      }
    },
    onError: (_err, _variables, context) => {
      // Rollback to previous state on error
      if (usePagination && !useFallback && context?.previousData) {
        queryClient.setQueryData(
          booksKeys.paginatedList(user?.uid || '', sortField, sortDirection),
          context.previousData
        );
      } else if ((!usePagination || useFallback) && context?.previousBooks) {
        queryClient.setQueryData(
          booksKeys.list(user?.uid || ''),
          context.previousBooks
        );
      }
    },
    onSettled: () => {
      // Invalidate the correct query key based on current mode
      const queryKey = (usePagination && !useFallback)
        ? booksKeys.paginatedList(user?.uid || '', sortField, sortDirection)
        : booksKeys.list(user?.uid || '');
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Toggle Favorite Mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ bookId, currentFavorite }: { bookId: string; currentFavorite: boolean }) =>
      booksService.updateBook(bookId, { isFavorite: !currentFavorite }),
    onMutate: async ({ bookId, currentFavorite }) => {
      if (usePagination && !useFallback) {
        // Optimistic update for paginated data
        await queryClient.cancelQueries({ 
          queryKey: booksKeys.paginatedList(user?.uid || '', sortField, sortDirection) 
        });
        
        const previousData = queryClient.getQueryData(
          booksKeys.paginatedList(user?.uid || '', sortField, sortDirection)
        );
        
        queryClient.setQueryData(
          booksKeys.paginatedList(user?.uid || '', sortField, sortDirection),
          (old: any) => {
            if (!old) return old;
            
            return {
              ...old,
              pages: old.pages.map((page: PaginatedResult<Book>) => ({
                ...page,
                items: page.items.map((book: Book) => 
                  book.id === bookId ? { ...book, isFavorite: !currentFavorite } : book
                )
              }))
            };
          }
        );
        
        return { previousData };
      } else {
        // Legacy optimistic update
        await queryClient.cancelQueries({ queryKey: booksKeys.list(user?.uid || '') });
        const previousBooks = queryClient.getQueryData<Book[]>(booksKeys.list(user?.uid || ''));
        
        queryClient.setQueryData<Book[]>(booksKeys.list(user?.uid || ''), (old = []) =>
          old.map((book) => (book.id === bookId ? { ...book, isFavorite: !currentFavorite } : book))
        );
        
        return { previousBooks };
      }
    },
    onError: (_err, _variables, context) => {
      // Rollback to previous state on error
      if (usePagination && !useFallback && context?.previousData) {
        queryClient.setQueryData(
          booksKeys.paginatedList(user?.uid || '', sortField, sortDirection),
          context.previousData
        );
      } else if ((!usePagination || useFallback) && context?.previousBooks) {
        queryClient.setQueryData(
          booksKeys.list(user?.uid || ''),
          context.previousBooks
        );
      }
    },
    onSettled: () => {
      // Invalidate the correct query key based on current mode
      const queryKey = (usePagination && !useFallback)
        ? booksKeys.paginatedList(user?.uid || '', sortField, sortDirection)
        : booksKeys.list(user?.uid || '');
      queryClient.invalidateQueries({ queryKey });
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
    
    // Pagination
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    
    // Sorting
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
    
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

