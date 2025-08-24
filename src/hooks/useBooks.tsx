import { useEffect, useState } from "react";
import type { Book } from "../types/Book";

import {
  getUserBooksData,
  addBook,
  deleteBook,
  updateBook,
} from "../services/booksService";
import { useUser } from "../hooks/useUser";

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userContext = useUser();
  const userId = userContext.user?.uid;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (userId) {
          const userBooks = await getUserBooksData(userId);
          setBooks(userBooks);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };
    fetchBooks();
  }, [userId]);

  const handleBookDelete = (bookId: string) => {
    const bookToDelete = books.find((book) => book.id === bookId);
    if (bookToDelete) {
      deleteBook(bookToDelete.id)
        .then(() => {
          const updatedBooks = books.filter((book) => book.id !== bookId);
          setBooks(updatedBooks);
        })
        .catch((error) => {
          console.error("Failed to delete book:", error);
        });
    }
  };

  const handleBookUpdate = async (
    bookId: string,
    updatedData: Partial<Book>,
  ) => {
    const bookToEdit = books.find((book) => book.id === bookId);
    if (bookToEdit) {
      const updatedBooks = books.map((book) =>
        book.id === bookId ? { ...book, ...updatedData } : book,
      );
      const result = await updateBook(bookId, updatedData);
      setBooks(updatedBooks);
      return result;
    }
  };

  const handleStatusChange = async (bookId: string, newStatus: string) => {
    const statuses = ["W trakcie", "Przeczytana", "Porzucona"];
    const nextStatus =
      statuses[(statuses.indexOf(newStatus) + 1) % statuses.length];

    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, read: nextStatus } : book,
    );
    await updateBook(bookId, { read: nextStatus });
    setBooks(updatedBooks);
  };

  const handleBookSubmit = async (book: Book) => {
    const createdAt = new Date().toISOString();
    const newBook: Omit<Book, "id"> = {
      title: book.title,
      author: book.author,
      read: book.read,
      overallPages: book.overallPages,
      readPages: book.readPages,
      cover: book.cover,
      genre: book.genre,
      rating: book.rating,
    };
    if (
      newBook.title &&
      newBook.author &&
      newBook.read &&
      newBook.overallPages
    ) {
      if (userId) {
        const newBookId = await addBook({
          ...newBook,
          userId: userId,
          createdAt: createdAt,
        });

        if (newBookId) {
          setBooks([
            { ...newBook, id: newBookId, createdAt: createdAt },
            ...books,
          ]);
        }
        return true;
      }
    }
    // e.target.reset();
  };

  return {
    books,
    loading,
    handleBookDelete,
    handleBookUpdate,
    handleStatusChange,
    handleBookSubmit,
  };
};
