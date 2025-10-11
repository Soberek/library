import {
  getUserBooksData,
  addBook,
  deleteBook,
  updateBook,
} from '../booksService';
import { collection, query, where, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

// Mock Firebase
jest.mock('firebase/firestore');
jest.mock('../../config/firebaseConfig', () => ({
  db: {},
}));

const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockQuery = query as jest.MockedFunction<typeof query>;
const mockWhere = where as jest.MockedFunction<typeof where>;
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;

describe('booksService', () => {
  const mockBook = {
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserBooksData', () => {
    it('should fetch user books successfully', async () => {
      const mockQuerySnapshot = {
        docs: [
          {
            id: '1',
            data: () => mockBook,
          },
        ],
      };

      mockCollection.mockReturnValue({} as never);
      mockQuery.mockReturnValue({} as never);
      mockWhere.mockReturnValue({} as never);
      mockGetDocs.mockResolvedValue(mockQuerySnapshot as never);

      const result = await getUserBooksData('test-user-id');

      expect(mockCollection).toHaveBeenCalledWith(db, 'books');
      expect(mockWhere).toHaveBeenCalledWith('userId', '==', 'test-user-id');
      expect(result).toEqual([{ ...mockBook, id: '1' }]);
    });

    it('should throw error when user ID is not provided', async () => {
      await expect(getUserBooksData('')).rejects.toMatchObject({
        code: 'FIREBASE_ERROR',
        message: 'Błąd Firebase. Spróbuj ponownie później.',
      });
    });

    it('should handle network errors', async () => {
      mockCollection.mockReturnValue({} as never);
      mockQuery.mockReturnValue({} as never);
      mockWhere.mockReturnValue({} as never);
      mockGetDocs.mockRejectedValue(new Error('Network error'));

      await expect(getUserBooksData('test-user-id')).rejects.toMatchObject({
        code: 'FIREBASE_ERROR',
      });
    });
  });

  describe('addBook', () => {
    it('should add book successfully', async () => {
      const bookToAdd = {
        ...mockBook,
        userId: 'test-user-id',
        createdAt: '2023-01-01T00:00:00.000Z',
      };

      mockCollection.mockReturnValue({} as never);
      mockAddDoc.mockResolvedValue({ id: 'new-book-id' } as never);

      const result = await addBook(bookToAdd);

      expect(mockCollection).toHaveBeenCalledWith(db, 'books');
      expect(mockAddDoc).toHaveBeenCalledWith({}, expect.objectContaining({
        title: 'Test Book',
        author: 'Test Author',
        read: 'W trakcie',
        overallPages: 100,
        readPages: 50,
        cover: 'https://example.com/cover.jpg',
        genre: 'Fiction',
        rating: 8,
        userId: 'test-user-id',
        createdAt: '2023-01-01T00:00:00.000Z',
      }));
      expect(result).toBe('new-book-id');
    });

    it('should validate book data before adding', async () => {
      const invalidBook = {
        title: '', // Invalid: empty title
        author: 'Test Author',
        read: 'W trakcie' as const,
        overallPages: 100,
        cover: 'https://example.com/cover.jpg',
        genre: 'Fiction',
        rating: 8,
        userId: 'test-user-id',
        createdAt: '2023-01-01T00:00:00.000Z',
      };

      await expect(addBook(invalidBook)).rejects.toMatchObject({
        code: 'FIREBASE_ERROR',
      });
    });
  });

  describe('deleteBook', () => {
    it('should delete book successfully', async () => {
      mockDoc.mockReturnValue({} as never);
      mockDeleteDoc.mockResolvedValue(undefined);

      await deleteBook('test-book-id');

      expect(mockDoc).toHaveBeenCalledWith(db, 'books', 'test-book-id');
      expect(mockDeleteDoc).toHaveBeenCalledWith({});
    });

    it('should throw error when book ID is not provided', async () => {
      await expect(deleteBook('')).rejects.toMatchObject({
        code: 'FIREBASE_ERROR',
        message: 'Błąd Firebase. Spróbuj ponownie później.',
      });
    });
  });

  describe('updateBook', () => {
    it('should update book successfully', async () => {
      const updateData = { title: 'Updated Title' };

      mockDoc.mockReturnValue({} as never);
      mockUpdateDoc.mockResolvedValue(undefined);

      const result = await updateBook('test-book-id', updateData);

      expect(mockDoc).toHaveBeenCalledWith(db, 'books', 'test-book-id');
      expect(mockUpdateDoc).toHaveBeenCalledWith({}, expect.objectContaining(updateData));
      expect(result).toBe(true);
    });

    it('should throw error when book ID is not provided', async () => {
      await expect(updateBook('', { title: 'Updated Title' })).rejects.toMatchObject({
        code: 'FIREBASE_ERROR',
        message: 'Błąd Firebase. Spróbuj ponownie później.',
      });
    });
  });
});
