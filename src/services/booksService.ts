import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { createFirebaseError, createNetworkError } from "../types/Error";
import { bookToAddSchema, bookUpdateSchema } from "../schemas/bookSchema";
import { ERROR_MESSAGES } from "../constants/validation";

import type { Book } from "../types/Book";

/**
 * Fetches all books for a specific user from Firestore
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
      throw createFirebaseError("User ID is required");
    }

    const booksCollection = collection(db, "books");
    const q = query(booksCollection, where("userId", "==", userId));
    const booksList = await getDocs(q);
    
    return booksList.docs.map((doc) => ({
      ...(doc.data() as Book),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching user books:", error);
    if (error instanceof Error && error.message.includes("network")) {
      throw createNetworkError(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw createFirebaseError(ERROR_MESSAGES.FIREBASE_ERROR);
  }
};

type BookWithId = Book & { id: string };

const getAllBooksData = async (): Promise<BookWithId[]> => {
  try {
    const booksCollection = collection(db, "books");
    const booksList = await getDocs(booksCollection);
    return booksList.docs.map((doc) => ({
      ...(doc.data() as Book),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching all books:", error);
    if (error instanceof Error && error.message.includes("network")) {
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
const addBook = async (book: import("../schemas/bookSchema").BookToAdd): Promise<string> => {
  try {
    // Validate the book data
    const validatedBook = bookToAddSchema.parse(book);
    
    const booksCollection = collection(db, "books");
    const docRef = await addDoc(booksCollection, validatedBook);
    return docRef.id;
  } catch (error) {
    console.error("Error adding book:", error);
    if (error instanceof Error && error.message.includes("network")) {
      throw createNetworkError(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw createFirebaseError(ERROR_MESSAGES.FIREBASE_ERROR);
  }
};

const deleteBook = async (bookId: string): Promise<void> => {
  try {
    if (!bookId) {
      throw createFirebaseError("Book ID is required");
    }

    const bookDoc = doc(db, "books", bookId);
    await deleteDoc(bookDoc);
  } catch (error) {
    console.error("Error deleting book:", error);
    if (error instanceof Error && error.message.includes("network")) {
      throw createNetworkError(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw createFirebaseError(ERROR_MESSAGES.FIREBASE_ERROR);
  }
};

const updateBook = async (
  bookId: string,
  updatedData: import("../schemas/bookSchema").BookUpdateData,
): Promise<boolean> => {
  try {
    if (!bookId) {
      throw createFirebaseError("Book ID is required");
    }

    // Validate the update data
    const validatedData = bookUpdateSchema.parse(updatedData);
    
    const bookDoc = doc(db, "books", bookId);
    await updateDoc(bookDoc, validatedData);
    return true;
  } catch (error) {
    console.error("Error updating book:", error);
    if (error instanceof Error && error.message.includes("network")) {
      throw createNetworkError(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw createFirebaseError(ERROR_MESSAGES.FIREBASE_ERROR);
  }
};

export { getUserBooksData, getAllBooksData, addBook, deleteBook, updateBook };
