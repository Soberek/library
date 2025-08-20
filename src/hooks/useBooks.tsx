import { useEffect, useState } from "react";
import type { Book } from "../types/Book";

function getBooksFromLocalStorage() {
  const savedBooks = localStorage.getItem("books");
  return savedBooks ? JSON.parse(savedBooks) : [];
}

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>(() => getBooksFromLocalStorage());
  const [stars, setStars] = useState<number>(0);

  useEffect(() => {
    // Save books to localStorage whenever they change
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  const handleBookDelete = (index: number) => {
    setBooks(books.filter((_, i) => i !== index));
  };

  const handleRatingChange = (id: number, rating: number) => {
    setBooks(
      books.map((book, index) => (index === id ? { ...book, rating } : book)),
    );
  };

  const handleStatusChange = (id: number) => {
    const statuses = ["W trakcie", "Przeczytana", "Porzucona"];

    setBooks(
      books.map((book, index) =>
        index === id
          ? {
              ...book,
              read: statuses[
                (statuses.indexOf(book.read) + 1) % statuses.length
              ],
            }
          : book,
      ),
    );
  };

  const handleStarClick = (index: number) => {
    setStars(index + 1);
  };

  const handleBookSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const newBook: Book = {
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
      setBooks([...books, newBook]);
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
