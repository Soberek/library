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
  const [stars, setStars] = useState<number>(0);
  const userContext = useUser();
  const userId = userContext.user?.uid;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (userId) {
          const userBooks = await getUserBooksData(userId);
          setBooks(userBooks);
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

  const handleStarClick = (index: number) => {
    setStars(index);
  };

  const handleBookSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const newBook: Omit<Book, "id"> = {
      title: form.get("title") as string,
      author: form.get("author") as string,
      read: form.get("read") as string,
      overallPages: Number(form.get("pages")),
      readPages: Number(form.get("readPages")),
      cover: form.get("cover") as string,
      genre: form.get("genre") as string,
      rating: stars,
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
          setBooks([...books, { ...newBook, id: newBookId }]);
        }
      }
    }
    // e.target.reset();
  };

  return {
    books,
    stars,
    handleBookDelete,
    handleRatingChange,
    handleStatusChange,
    handleStarClick,
    handleBookSubmit,
  };
};
