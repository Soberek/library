import { useEffect, useState } from "react";
import type { Book } from "../types/Book";

import {
  getUserBooksData,
  addBook,
  deleteBook,
  updateBook,
} from "../services/booksService";
import { useUser } from "../providers/UserContext";

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
  }, [userContext.user?.uid]);

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

  // TODO
  const handleRatingChange = (id: string, rating: number) => {
    const bookToUpdate = books.find((book) => book.id === id);
    if (bookToUpdate) {
      const updatedBooks = books.map((book) =>
        book.id === id ? { ...book, rating } : book,
      );
      setBooks(updatedBooks);
      updateBook(id, { rating });
    }
  };

  const handleStatusChange = (bookId: string, newStatus: string) => {
    const statuses = ["W trakcie", "Przeczytana", "Porzucona"];
    const nextStatus =
      statuses[(statuses.indexOf(newStatus) + 1) % statuses.length];

    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, read: nextStatus } : book,
    );
    setBooks(updatedBooks);
    updateBook(bookId, { read: nextStatus });
  };

  const handleBookSubmit = async (book: Book) => {
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
      newBook.overallPages &&
      newBook.cover
    ) {
      if (userId) {
        const newBookId = await addBook({ ...newBook, userId: userId });
        if (newBookId) {
          setBooks([{ ...newBook, id: newBookId }, ...books]);
        }
      }
    }
    // e.target.reset();
  };

  return {
    books,
    loading,
    handleBookDelete,
    handleRatingChange,
    handleStatusChange,
    handleBookSubmit,
  };
};
