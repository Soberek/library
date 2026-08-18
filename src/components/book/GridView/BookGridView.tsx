import React from "react";
import BookCard from "./BookCard";
import type { Book, BookStatus } from "../../../types/Book";

interface BookGridViewProps {
  books: Book[];
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  onRatingChange?: (bookId: string, newRating: number) => void;
  onPagesChange?: (bookId: string, newReadPages: number, overallPages?: number) => void;
}

export const BookGridView: React.FC<BookGridViewProps> = ({
  books,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleFavorite,
  onRatingChange,
  onPagesChange,
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {books.map((book) => (
          <div key={book.id} className="w-full flex flex-col fade-in-up">
            <BookCard
              book={book}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onToggleFavorite={onToggleFavorite}
              onRatingChange={onRatingChange}
              onPagesChange={onPagesChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookGridView;
