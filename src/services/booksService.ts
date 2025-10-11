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
    
    // Note: sortField and sortDirection parameters are currently not used
    // to avoid Firebase index requirements. To enable sorting, create the
    // required composite index in Firebase Console.
    // Future enhancement: Use sortField and sortDirection once indexes are created
    console.log(`Pagination request - sortField: ${sortField}, sortDirection: ${sortDirection} (currently ignored to avoid index requirements)`);
    
    // Use a simple query without orderBy to avoid index requirements
    // This means books will be in document ID order, not by createdAt or other fields
    let q = query(
      booksCollection,
      where('userId', '==', userId),
      limit(pageSize + 1)
    );
    
    // If we have a last document, add pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    // Log that we're using a simple query
    console.log(`Using simple paginated query (no ordering) for user ${userId}, pageSize: ${pageSize}, hasLastDoc: ${!!lastDoc}`);

    // Execute the query with error handling
    let booksList;
    try {
      booksList = await getDocs(q);
    } catch (error: any) {
      console.error('Error executing paginated query:', error);
      
      // Check if the error is related to indexes or failed preconditions
      const errorString = error?.toString() || '';
      const errorCode = error?.code || '';
      const isIndexError = error instanceof Error && 
        (errorString.includes('index') || 
         errorString.includes('failed-precondition') ||
         errorCode === 'failed-precondition');
      
      if (isIndexError) {
        console.log('Index error detected, falling back to simple query');
        
        // Create a simple query, but maintain pagination if we have lastDoc
        if (lastDoc) {
          // If we have a lastDoc, we need to use a query that's compatible with it
          // This means we can't change the orderBy field
          console.warn('Cannot paginate with different query structure, returning empty result');
          return {
            items: [],
            lastDoc: null,
            hasMore: false
          };
        }
        
        // Try the simplest possible query without ordering
        q = query(
          booksCollection,
          where('userId', '==', userId),
          limit(pageSize + 1)
        );
        
        try {
          booksList = await getDocs(q);
        } catch (fallbackError) {
          console.error('Even fallback query failed:', fallbackError);
          throw createFirebaseError('Wystąpił błąd podczas pobierania książek. Spróbuj ponownie.');
        }
      } else {
        throw error; // Re-throw if it's not an index issue
      }
    }
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
