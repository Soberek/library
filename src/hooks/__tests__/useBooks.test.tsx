import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBooksQuery } from '../useBooksQuery';
import * as booksService from '../../services/booksService';
import { useAuth } from '../useAuth';
import type { Book } from '../../types/Book';

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

// At top of file, mock the service
jest.mock('../../services/booksService', () => ({
  getUserBooksData: jest.fn(),
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
    (booksService.updateBook as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('should fetch books on mount', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooks);

    const { result } = renderHook(() => useBooksQuery(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.books).toEqual([]);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(booksService.getUserBooksData).toHaveBeenCalledWith('test-user-id');
    await waitFor(() => expect(result.current.books).toEqual(mockBooks));
    expect(result.current.loading).toBe(false);
  });

  it('should handle book deletion', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooks);
    (booksService.deleteBook as jest.Mock).mockImplementation(async (_: string) => {
      // Update mock to return empty array after deletion
      (booksService.getUserBooksData as jest.Mock).mockResolvedValue([]);
      return Promise.resolve(true);
    });

    const { result } = renderHook(() => useBooksQuery(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.handleBookDelete('1');
    });

    expect(booksService.deleteBook).toHaveBeenCalledWith('1');
    await waitFor(() => expect(result.current.books).toEqual([]));
  });

  it('should handle book status change', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooks);
    (booksService.updateBook as jest.Mock).mockImplementation(async (bookId: string, updatedBook: Partial<Book>) => {
      // Update mock to return updated data
      const updatedBooks = mockBooks.map(book => 
        book.id === bookId ? { ...book, ...updatedBook } : book
      );
      (booksService.getUserBooksData as jest.Mock).mockResolvedValue(updatedBooks);
      return Promise.resolve(true);
    });

    const { result } = renderHook(() => useBooksQuery(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.handleStatusChange('1', 'W trakcie');
    });

    expect(booksService.updateBook).toHaveBeenCalledWith('1', { read: 'Przeczytana' });
    await waitFor(() => expect(result.current.books[0].read).toBe('Przeczytana'));
  });

  it('should calculate books statistics correctly', async () => {
    const booksWithDifferentStatuses = [
      { ...mockBooks[0], id: '1', read: 'Przeczytana' as const },
      { ...mockBooks[0], id: '2', read: 'W trakcie' as const },
      { ...mockBooks[0], id: '3', read: 'Porzucona' as const },
    ];

    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(booksWithDifferentStatuses);

    const { result } = renderHook(() => useBooksQuery(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await waitFor(() => expect(result.current.booksStats).toEqual({
      total: 3,
      read: 1,
      inProgress: 1,
      dropped: 1,
    }));
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Network error');
    (booksService.getUserBooksData as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useBooksQuery(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(result.current.loading).toBe(false);
  });

  it('toggles favorite status correctly', async () => {
    (booksService.updateBook as jest.Mock).mockImplementation(async (bookId: string, updatedBook: Partial<Book>) => {
      // Update mock to return updated data
      const updatedBooks = mockBooksWithFavorites.map(book => 
        book.id === bookId ? { ...book, ...updatedBook } : book
      );
      (booksService.getUserBooksData as jest.Mock).mockResolvedValue(updatedBooks);
      return Promise.resolve(true);
    });

    const { result } = renderHook(() => useBooksQuery(), { wrapper });
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

  it('fetches books with isFavorite field', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooksWithFavorites);

    const { result } = renderHook(() => useBooksQuery(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.books[0].isFavorite).toBeDefined();
    expect(result.current.books[0].isFavorite).toBe(true);
  });

  it('should handle book rating change', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooks);
    (booksService.updateBook as jest.Mock).mockImplementation(async (bookId: string, updatedBook: Partial<Book>) => {
      // Update mock to return updated data
      const updatedBooks = mockBooks.map(book => 
        book.id === bookId ? { ...book, ...updatedBook } : book
      );
      (booksService.getUserBooksData as jest.Mock).mockResolvedValue(updatedBooks);
      return Promise.resolve(true);
    });

    const { result } = renderHook(() => useBooksQuery(), { wrapper });

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
});
