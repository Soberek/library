import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBooksQuery } from '../useBooksQuery';
import * as booksService from '../../services/booksService';
import { useAuth } from '../useAuth';
import type { Book } from '../../types/Book';
import { QueryDocumentSnapshot, type DocumentData } from 'firebase/firestore';

// Mock the dependencies
jest.mock('../useAuth');
jest.mock('../../services/booksService');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockBooksWithFavorites = [
  {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    genre: 'fiction',
    read: 'W trakcie' as const,
    rating: 8,
    overallPages: 300,
    readPages: 150,
    isFavorite: true,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Another Test Book',
    author: 'Another Author',
    genre: 'fantasy',
    read: 'Przeczytana' as const,
    rating: 9,
    overallPages: 400,
    readPages: 400,
    isFavorite: false,
    createdAt: '2023-02-01T00:00:00Z',
  },
];

// Mock the last document for pagination
const mockLastDoc = {} as QueryDocumentSnapshot<DocumentData>;

// At top of file, mock the service
jest.mock('../../services/booksService', () => ({
  getUserBooksData: jest.fn(),
  getUserBooksDataPaginated: jest.fn(),
  addBook: jest.fn(),
  deleteBook: jest.fn(),
  updateBook: jest.fn(),
}));

const mockBooks = [
  {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    read: 'W trakcie' as const,
    overallPages: 100,
    readPages: 50,
    cover: 'https://example.com/cover.jpg',
    genre: 'Fiction',
    rating: 8,
    createdAt: '2023-01-01T00:00:00.000Z',
  },
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      // Threshold for "optimistic" vs "eager" updates
      // https://tanstack.com/query/v5/docs/react/guides/testing#turn-off-retries
      // We're setting it to 0 to disable optimistic updates for tests
      // and avoid race conditions.
      // See also: https://github.com/TanStack/query/issues/1353
      retryDelay: 0,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useBooksQuery', () => {
  const mockUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: jest.fn(),
    getIdToken: jest.fn(),
    getIdTokenResult: jest.fn(),
    reload: jest.fn(),
    toJSON: jest.fn(),
    displayName: null,
    phoneNumber: null,
    photoURL: null,
    providerId: 'firebase',
  };

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    });
    jest.clearAllMocks();
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooksWithFavorites);
    (booksService.getUserBooksDataPaginated as jest.Mock).mockResolvedValue({
      items: mockBooksWithFavorites,
      lastDoc: mockLastDoc,
      hasMore: false
    });
    (booksService.updateBook as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('should fetch books on mount with pagination', async () => {
    (booksService.getUserBooksDataPaginated as jest.Mock).mockResolvedValue({
      items: mockBooks,
      lastDoc: mockLastDoc,
      hasMore: false
    });

    const { result } = renderHook(() => useBooksQuery(true, 12), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.books).toEqual([]);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(booksService.getUserBooksDataPaginated).toHaveBeenCalledWith(
      'test-user-id', 12, null, 'createdAt', 'desc'
    );
    await waitFor(() => expect(result.current.books).toEqual(mockBooks));
    expect(result.current.loading).toBe(false);
  });

  it('should fetch books on mount without pagination (legacy mode)', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooks);

    const { result } = renderHook(() => useBooksQuery(false), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.books).toEqual([]);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(booksService.getUserBooksData).toHaveBeenCalledWith('test-user-id');
    await waitFor(() => expect(result.current.books).toEqual(mockBooks));
    expect(result.current.loading).toBe(false);
  });

  it('should handle book deletion with pagination', async () => {
    // Setup initial data
    (booksService.getUserBooksDataPaginated as jest.Mock).mockResolvedValue({
      items: mockBooks,
      lastDoc: mockLastDoc,
      hasMore: false
    });
    
    // Setup deletion behavior
    (booksService.deleteBook as jest.Mock).mockImplementation(async (_: string) => {
      // Update mock to return empty array after deletion
      (booksService.getUserBooksDataPaginated as jest.Mock).mockResolvedValue({
        items: [],
        lastDoc: null,
        hasMore: false
      });
      return Promise.resolve(true);
    });

    const { result } = renderHook(() => useBooksQuery(true), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.handleBookDelete('1');
    });

    expect(booksService.deleteBook).toHaveBeenCalledWith('1');
    await waitFor(() => expect(result.current.books).toEqual([]));
  });
  
  it('should handle book deletion without pagination', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooks);
    (booksService.deleteBook as jest.Mock).mockImplementation(async (_: string) => {
      // Update mock to return empty array after deletion
      (booksService.getUserBooksData as jest.Mock).mockResolvedValue([]);
      return Promise.resolve(true);
    });

    const { result } = renderHook(() => useBooksQuery(false), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.handleBookDelete('1');
    });

    expect(booksService.deleteBook).toHaveBeenCalledWith('1');
    await waitFor(() => expect(result.current.books).toEqual([]));
  });

  it('should handle book status change with pagination', async () => {
    // Setup initial data
    (booksService.getUserBooksDataPaginated as jest.Mock).mockResolvedValue({
      items: mockBooks,
      lastDoc: mockLastDoc,
      hasMore: false
    });
    
    // Setup update behavior
    (booksService.updateBook as jest.Mock).mockImplementation(async (bookId: string, updatedBook: Partial<Book>) => {
      // Update mock to return updated data
      const updatedBooks = mockBooks.map(book => 
        book.id === bookId ? { ...book, ...updatedBook } : book
      );
      (booksService.getUserBooksDataPaginated as jest.Mock).mockResolvedValue({
        items: updatedBooks,
        lastDoc: mockLastDoc,
        hasMore: false
      });
      return Promise.resolve(true);
    });

    const { result } = renderHook(() => useBooksQuery(true), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.handleStatusChange('1', 'W trakcie');
    });

    expect(booksService.updateBook).toHaveBeenCalledWith('1', { read: 'Przeczytana' });
    await waitFor(() => expect(result.current.books[0].read).toBe('Przeczytana'));
  });
  
  it('should handle book status change without pagination', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooks);
    (booksService.updateBook as jest.Mock).mockImplementation(async (bookId: string, updatedBook: Partial<Book>) => {
      // Update mock to return updated data
      const updatedBooks = mockBooks.map(book => 
        book.id === bookId ? { ...book, ...updatedBook } : book
      );
      (booksService.getUserBooksData as jest.Mock).mockResolvedValue(updatedBooks);
      return Promise.resolve(true);
    });

    const { result } = renderHook(() => useBooksQuery(false), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.handleStatusChange('1', 'W trakcie');
    });

    expect(booksService.updateBook).toHaveBeenCalledWith('1', { read: 'Przeczytana' });
    await waitFor(() => expect(result.current.books[0].read).toBe('Przeczytana'));
  });

  it('should calculate books statistics correctly with pagination', async () => {
    const booksWithDifferentStatuses = [
      { ...mockBooks[0], id: '1', read: 'Przeczytana' as const },
      { ...mockBooks[0], id: '2', read: 'W trakcie' as const },
      { ...mockBooks[0], id: '3', read: 'Porzucona' as const },
    ];

    (booksService.getUserBooksDataPaginated as jest.Mock).mockResolvedValue({
      items: booksWithDifferentStatuses,
      lastDoc: mockLastDoc,
      hasMore: false
    });

    const { result } = renderHook(() => useBooksQuery(true), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await waitFor(() => expect(result.current.booksStats).toEqual({
      total: 3,
      read: 1,
      inProgress: 1,
      dropped: 1,
      wantToRead: 0,
    }));
  });

  it('should handle errors gracefully with pagination', async () => {
    const error = new Error('Network error');
    (booksService.getUserBooksDataPaginated as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useBooksQuery(true), { wrapper });

    // Wait for the error to be defined (after retry attempts)
    await waitFor(() => expect(result.current.error).toBeDefined(), { timeout: 3000 });
    
    // After error is defined, loading should eventually become false
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });
  });
  
  it('should handle errors gracefully without pagination', async () => {
    const error = new Error('Network error');
    (booksService.getUserBooksData as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useBooksQuery(false), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(result.current.loading).toBe(false);
  });

  it('toggles favorite status correctly with pagination', async () => {
    (booksService.getUserBooksDataPaginated as jest.Mock).mockResolvedValue({
      items: mockBooksWithFavorites,
      lastDoc: mockLastDoc,
      hasMore: false
    });
    
    (booksService.updateBook as jest.Mock).mockImplementation(async (bookId: string, updatedBook: Partial<Book>) => {
      // Update mock to return updated data
      const updatedBooks = mockBooksWithFavorites.map(book => 
        book.id === bookId ? { ...book, ...updatedBook } : book
      );
      (booksService.getUserBooksDataPaginated as jest.Mock).mockResolvedValue({
        items: updatedBooks,
        lastDoc: mockLastDoc,
        hasMore: false
      });
      return Promise.resolve(true);
    });

    const { result } = renderHook(() => useBooksQuery(true), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    const bookId = result.current.books[0].id;
    const currentFavorite = result.current.books[0].isFavorite || false;

    await act(async () => {
      await result.current.handleToggleFavorite(bookId, currentFavorite);
    });

    expect(booksService.updateBook).toHaveBeenCalledWith(bookId, { isFavorite: !currentFavorite });
    await waitFor(() => {
      const updatedBook = result.current.books.find((b: Book) => b.id === bookId);
      expect(updatedBook?.isFavorite).toBe(!currentFavorite);
    });
  });
  
  it('toggles favorite status correctly without pagination', async () => {
    (booksService.updateBook as jest.Mock).mockImplementation(async (bookId: string, updatedBook: Partial<Book>) => {
      // Update mock to return updated data
      const updatedBooks = mockBooksWithFavorites.map(book => 
        book.id === bookId ? { ...book, ...updatedBook } : book
      );
      (booksService.getUserBooksData as jest.Mock).mockResolvedValue(updatedBooks);
      return Promise.resolve(true);
    });

    const { result } = renderHook(() => useBooksQuery(false), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    const bookId = result.current.books[0].id;
    const currentFavorite = result.current.books[0].isFavorite || false;

    await act(async () => {
      await result.current.handleToggleFavorite(bookId, currentFavorite);
    });

    expect(booksService.updateBook).toHaveBeenCalledWith(bookId, { isFavorite: !currentFavorite });
    await waitFor(() => {
      const updatedBook = result.current.books.find((b: Book) => b.id === bookId);
      expect(updatedBook?.isFavorite).toBe(!currentFavorite);
    });
  });

  it('fetches books with isFavorite field with pagination', async () => {
    (booksService.getUserBooksDataPaginated as jest.Mock).mockResolvedValue({
      items: mockBooksWithFavorites,
      lastDoc: mockLastDoc,
      hasMore: false
    });

    const { result } = renderHook(() => useBooksQuery(true), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.books[0].isFavorite).toBeDefined();
    expect(result.current.books[0].isFavorite).toBe(true);
  });
  
  it('fetches books with isFavorite field without pagination', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooksWithFavorites);

    const { result } = renderHook(() => useBooksQuery(false), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.books[0].isFavorite).toBeDefined();
    expect(result.current.books[0].isFavorite).toBe(true);
  });

  it('should handle book rating change with pagination', async () => {
    (booksService.getUserBooksDataPaginated as jest.Mock).mockResolvedValue({
      items: mockBooks,
      lastDoc: mockLastDoc,
      hasMore: false
    });
    
    (booksService.updateBook as jest.Mock).mockImplementation(async (bookId: string, updatedBook: Partial<Book>) => {
      // Update mock to return updated data
      const updatedBooks = mockBooks.map(book => 
        book.id === bookId ? { ...book, ...updatedBook } : book
      );
      (booksService.getUserBooksDataPaginated as jest.Mock).mockResolvedValue({
        items: updatedBooks,
        lastDoc: mockLastDoc,
        hasMore: false
      });
      return Promise.resolve(true);
    });

    const { result } = renderHook(() => useBooksQuery(true), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const bookId = mockBooks[0].id;
    const newRating = 5;

    await act(async () => {
      await result.current.handleRatingChange(bookId, newRating);
    });

    expect(booksService.updateBook).toHaveBeenCalledWith(bookId, { rating: newRating });
    await waitFor(() => expect(result.current.books[0].rating).toBe(newRating));
  });
  
  it('should handle book rating change without pagination', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooks);
    (booksService.updateBook as jest.Mock).mockImplementation(async (bookId: string, updatedBook: Partial<Book>) => {
      // Update mock to return updated data
      const updatedBooks = mockBooks.map(book => 
        book.id === bookId ? { ...book, ...updatedBook } : book
      );
      (booksService.getUserBooksData as jest.Mock).mockResolvedValue(updatedBooks);
      return Promise.resolve(true);
    });

    const { result } = renderHook(() => useBooksQuery(false), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const bookId = mockBooks[0].id;
    const newRating = 5;

    await act(async () => {
      await result.current.handleRatingChange(bookId, newRating);
    });

    expect(booksService.updateBook).toHaveBeenCalledWith(bookId, { rating: newRating });
    await waitFor(() => expect(result.current.books[0].rating).toBe(newRating));
  });
  
  it('should support pagination controls', async () => {
    // Setup initial data with hasMore = true
    (booksService.getUserBooksDataPaginated as jest.Mock).mockResolvedValue({
      items: mockBooks,
      lastDoc: mockLastDoc,
      hasMore: true
    });
    
    const { result } = renderHook(() => useBooksQuery(true), { wrapper });
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Check pagination properties
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.fetchNextPage).toBeDefined();
    
    // Setup next page data
    const nextPageBooks = [
      { ...mockBooks[0], id: '2', title: 'Second Book' }
    ];
    
    (booksService.getUserBooksDataPaginated as jest.Mock).mockImplementationOnce(
      async (_userId: string, _pageSize: number, lastDoc: any) => {
        expect(lastDoc).toBe(mockLastDoc); // Verify lastDoc is passed correctly
        return {
          items: nextPageBooks,
          lastDoc: null,
          hasMore: false
        };
      }
    );
    
    // Fetch next page
    await act(async () => {
      await result.current.fetchNextPage();
    });
    
    // Verify combined results
    await waitFor(() => {
      expect(result.current.books.length).toBe(2);
      expect(result.current.books[0].id).toBe('1');
      expect(result.current.books[1].id).toBe('2');
    });
    
    // Verify hasNextPage is now false
    expect(result.current.hasNextPage).toBe(false);
  });
});
