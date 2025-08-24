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

import type { Book } from "../types/Book";

const getUserBooksData = async (userId: string) => {
  try {
    const booksCollection = collection(db, "books");
    const q = query(booksCollection, where("userId", "==", userId));
    const booksList = await getDocs(q);
    return booksList.docs.map((doc) => ({
      ...(doc.data() as Book),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching user books:", error);
    throw new Error("Failed to fetch user books");
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
    throw new Error("Failed to fetch all books");
  }
};

type BookToAdd = Omit<Book, "id" | "userId"> & {
  userId: string;
  createdAt: string;
};

const addBook = async (book: BookToAdd): Promise<string> => {
  try {
    const booksCollection = collection(db, "books");
    const docRef = await addDoc(booksCollection, book);
    return docRef.id;
  } catch (error) {
    console.error("Error adding book:", error);
    throw new Error("Failed to add book");
  }
};

const deleteBook = async (bookId: string): Promise<void> => {
  try {
    const bookDoc = doc(db, "books", bookId);
    await deleteDoc(bookDoc);
  } catch (error) {
    console.error("Error deleting book:", error);
    throw new Error("Failed to delete book");
  }
};

const updateBook = async (
  bookId: string,
  updatedData: Partial<Book>,
): Promise<boolean> => {
  try {
    const bookDoc = doc(db, "books", bookId);
    await updateDoc(bookDoc, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating book:", error);
    throw new Error("Failed to update book");
  }
};

export { getUserBooksData, getAllBooksData, addBook, deleteBook, updateBook };
