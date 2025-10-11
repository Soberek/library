import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  limit,
  startAfter,
  orderBy,
  QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { createFirebaseError, createNetworkError } from '../types/Error';
import { bookToAddSchema, bookUpdateSchema } from '../schemas/bookSchema';
import { ERROR_MESSAGES } from '../constants/validation';

import type { Book } from '../types/Book';
import type { BookFormData } from '../types/Book';

export interface PaginatedResult<T> {
  items: T[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

/**
 * Fetches books for a specific user from Firestore with pagination
 * 
 * @param userId - The unique identifier of the user
 * @param pageSize - Number of books to fetch per page (default: 12)
 * @param lastDoc - Last document from previous query for pagination
 * @param sortField - Field to sort by (default: 'createdAt')
 * @param sortDirection - Direction to sort ('asc' or 'desc', default: 'desc')
 * @returns Promise that resolves to a PaginatedResult with books array and pagination info
 * @throws {FirebaseError} When user ID is invalid or Firebase operation fails
 * @throws {NetworkError} When network connection fails
 * 
 * @example
 * ```ts
 * const result = await getUserBooksDataPaginated("user123", 12);
 * console.log(result.items); // [{ id: "1", title: "Book 1", ... }, ...]
 * console.log(result.hasMore); // true if more books exist
 * 
 * // To fetch next page:
 * const nextPage = await getUserBooksDataPaginated("user123", 12, result.lastDoc);
 * ```
 */
const getUserBooksDataPaginated = async (
  userId: string,
  pageSize: number = 12,
  lastDoc: QueryDocumentSnapshot<DocumentData> | null = null,
  sortField: string = 'createdAt',
  sortDirection: 'asc' | 'desc' = 'desc'
): Promise<PaginatedResult<Book>> => {
  try {
    if (!userId) {
      throw createFirebaseError('User ID is required');
    }

    const booksCollection = collection(db, 'books');
    let q;
    
    // For createdAt field, we know the index exists by default
    if (sortField === 'createdAt') {
      q = query(
        booksCollection,
        where('userId', '==', userId),
        orderBy(sortField, sortDirection),
        limit(pageSize + 1) // Fetch one extra to check if more exist
      );
    } else {
      // For other fields, we need to be careful with indexes
      try {
        // First try with compound query that requires index
        q = query(
          booksCollection,
          where('userId', '==', userId),
          orderBy(sortField, sortDirection),
          limit(pageSize + 1) // Fetch one extra to check if more exist
        );
      } catch (error) {
        // Fallback to default sort by createdAt if index doesn't exist
        console.error(`Firebase index error for field ${sortField}, falling back to createdAt:`, error);
        q = query(
          booksCollection,
          where('userId', '==', userId),
          orderBy('createdAt', sortDirection),
          limit(pageSize + 1)
        );
      }
    }

    // If we have a last document, start after it for pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const booksList = await getDocs(q);
    const hasMore = booksList.docs.length > pageSize;
    
    // Remove the extra document we used to check for more
    const docs = hasMore ? booksList.docs.slice(0, pageSize) : booksList.docs;
    
    const books = docs.map((doc) => ({
      ... (doc.data() as Book),
      id: doc.id,
      overallPages: Number((doc.data() as Book).overallPages || 0),
      rating: Number((doc.data() as Book).rating || 0),
    }));

    return {
      items: books,
      lastDoc: docs.length > 0 ? docs[docs.length - 1] : null,
      hasMore
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('network')) {
      throw createNetworkError(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw createFirebaseError(ERROR_MESSAGES.FIREBASE_ERROR);
  }
};

/**
 * Fetches all books for a specific user from Firestore (legacy method, consider using paginated version)
 * 
 * @param userId - The unique identifier of the user
 * @returns Promise that resolves to an array of Book objects
 * @throws {FirebaseError} When user ID is invalid or Firebase operation fails
 * @throws {NetworkError} When network connection fails
 * 
 * @example
 * ```ts
 * const books = await getUserBooksData("user123");
 * console.log(books); // [{ id: "1", title: "Book 1", ... }, ...]
 * ```
 */
const getUserBooksData = async (userId: string): Promise<Book[]> => {
  try {
    if (!userId) {
      throw createFirebaseError('User ID is required');
    }

    const booksCollection = collection(db, 'books');
    const q = query(booksCollection, where('userId', '==', userId));
    const booksList = await getDocs(q);
    
    return booksList.docs.map((doc) => ({
      ... (doc.data() as Book),
      id: doc.id,
      overallPages: Number((doc.data() as Book).overallPages || 0),
      rating: Number((doc.data() as Book).rating || 0),
    }));
  } catch (error) {
    if (error instanceof Error && error.message.includes('network')) {
      throw createNetworkError(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw createFirebaseError(ERROR_MESSAGES.FIREBASE_ERROR);
  }
};

type BookWithId = Book & { id: string };

const getAllBooksData = async (): Promise<BookWithId[]> => {
  try {
    const booksCollection = collection(db, 'books');
    const booksList = await getDocs(booksCollection);
    return booksList.docs.map((doc) => ({
      ... (doc.data() as Book),
      id: doc.id,
      overallPages: Number((doc.data() as Book).overallPages || 0),
      rating: Number((doc.data() as Book).rating || 0),
    }));
  } catch (error) {
    if (error instanceof Error && error.message.includes('network')) {
      throw createNetworkError(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw createFirebaseError(ERROR_MESSAGES.FIREBASE_ERROR);
  }
};

/**
 * Adds a new book to Firestore
 * 
 * @param book - The book data to add (validated against schema)
 * @returns Promise that resolves to the document ID of the created book
 * @throws {ValidationError} When book data fails validation
 * @throws {FirebaseError} When Firebase operation fails
 * @throws {NetworkError} When network connection fails
 * 
 * @example
 * ```ts
 * const bookId = await addBook({
 *   title: "New Book",
 *   author: "Author Name",
 *   read: "W trakcie",
 *   overallPages: 300,
 *   genre: "Fiction",
 *   rating: 8,
 *   userId: "user123",
 *   createdAt: "2023-01-01T00:00:00.000Z"
 * });
 * ```
 */
const addBook = async (bookData: BookFormData): Promise<string | null> => {
  try {
    // Validate and parse the book data (ensures all fields are correct types/values)
    const validatedBook = bookToAddSchema.parse(bookData);
    
    const booksCollection = collection(db, 'books');
    const docRef = await addDoc(booksCollection, validatedBook);
    return docRef.id;
  } catch (error) {
    if (error instanceof Error && error.message.includes('network')) {
      throw createNetworkError(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw createFirebaseError(ERROR_MESSAGES.FIREBASE_ERROR);
  }
};

const deleteBook = async (bookId: string): Promise<void> => {
  try {
    if (!bookId) {
      throw createFirebaseError('Book ID is required');
    }

    const bookDoc = doc(db, 'books', bookId);
    await deleteDoc(bookDoc);
  } catch (error) {
    if (error instanceof Error && error.message.includes('network')) {
      throw createNetworkError(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw createFirebaseError(ERROR_MESSAGES.FIREBASE_ERROR);
  }
};

const updateBook = async (bookId: string, updatedData: Partial<Book>): Promise<boolean> => {
  try {
    if (!bookId) {
      throw createFirebaseError('Book ID is required');
    }

    // Validate and parse the update data (ensures types are correct, e.g., isFavorite is boolean)
    const validatedData = bookUpdateSchema.parse(updatedData);
    
    const bookDoc = doc(db, 'books', bookId);
    await updateDoc(bookDoc, validatedData);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('network')) {
      throw createNetworkError(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw createFirebaseError(ERROR_MESSAGES.FIREBASE_ERROR);
  }
};

export { 
  getUserBooksData, 
  getUserBooksDataPaginated,
  getAllBooksData, 
  addBook, 
  deleteBook, 
  updateBook 
};
