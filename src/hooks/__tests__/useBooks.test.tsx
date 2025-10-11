import { renderHook, act, waitFor } from '@testing-library/react';
import { useBooks } from '../useBooks';
import * as booksService from '../../services/booksService';
import { useUser } from '../useUser';

// Mock the dependencies
jest.mock('../useUser');
jest.mock('../../services/booksService');

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
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
  // Add more as needed
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

describe('useBooks', () => {
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
    mockUseUser.mockReturnValue({
      user: mockUser,
      loading: false,
    });
    jest.clearAllMocks();
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooksWithFavorites);
    (booksService.updateBook as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch books on mount', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooks);

    const { result } = renderHook(() => useBooks());

    expect(result.current.loading).toBe(true);
    expect(result.current.books).toEqual([]);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(booksService.getUserBooksData).toHaveBeenCalledWith('test-user-id');
    expect(result.current.books).toEqual(mockBooks);
    expect(result.current.loading).toBe(false);
  });

  it('should handle book deletion', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooks);
    (booksService.deleteBook as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useBooks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.handleBookDelete('1');
    });

    expect(booksService.deleteBook).toHaveBeenCalledWith('1');
    expect(result.current.books).toEqual([]);
  });

  it('should handle book status change', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooks);
    (booksService.updateBook as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useBooks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.handleStatusChange('1', 'W trakcie');
    });

    expect(booksService.updateBook).toHaveBeenCalledWith('1', { read: 'Przeczytana' });
    expect(result.current.books[0].read).toBe('Przeczytana');
  });

  it('should calculate books statistics correctly', async () => {
    const booksWithDifferentStatuses = [
      { ...mockBooks[0], id: '1', read: 'Przeczytana' as const },
      { ...mockBooks[0], id: '2', read: 'W trakcie' as const },
      { ...mockBooks[0], id: '3', read: 'Porzucona' as const },
    ];

    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(booksWithDifferentStatuses);

    const { result } = renderHook(() => useBooks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.booksStats).toEqual({
      total: 3,
      read: 1,
      inProgress: 1,
      dropped: 1,
    });
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Network error');
    (booksService.getUserBooksData as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useBooks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.loading).toBe(false);
  });

  it('toggles favorite status correctly', async () => {
    const { result } = renderHook(() => useBooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const bookId = result.current.books[0].id;
    const currentFavorite = result.current.books[0].isFavorite || false;

    await act(async () => {
      await result.current.handleToggleFavorite(bookId, currentFavorite);
    });

    expect(booksService.updateBook).toHaveBeenCalledWith(bookId, { isFavorite: !currentFavorite });
    const updatedBooks = result.current.books;
    const updatedBook = updatedBooks.find(b => b.id === bookId);
    expect(updatedBook?.isFavorite).toBe(!currentFavorite);
  });

  it('fetches books with isFavorite field', async () => {
    (booksService.getUserBooksData as jest.Mock).mockResolvedValue(mockBooksWithFavorites);

    const { result } = renderHook(() => useBooks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.books[0].isFavorite).toBeDefined();
    expect(result.current.books[0].isFavorite).toBe(true);
  });
});
