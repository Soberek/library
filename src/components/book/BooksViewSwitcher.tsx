import React from "react";
import { BookGridView } from "./GridView";
import { BookTableView } from "./TableView";
import type { Book, BookStatus } from "../../types/Book";

interface BooksViewSwitcherProps {
  books: Book[];
  viewMode: "cards" | "table";
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  onRatingChange?: (bookId: string, newRating: number) => void;
}

export const BooksViewSwitcher: React.FC<BooksViewSwitcherProps> = ({
  books,
  viewMode,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleFavorite,
  onRatingChange,
}) => {
  if (viewMode === "table") {
    return (
      <BookTableView
        books={books}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onToggleFavorite={onToggleFavorite}
        onRatingChange={onRatingChange}
      />
    );
  }

  return (
    <BookGridView
      books={books}
      onEdit={onEdit}
      onDelete={onDelete}
      onStatusChange={onStatusChange}
      onToggleFavorite={onToggleFavorite}
      onRatingChange={onRatingChange}
    />
  );
};

export default BooksViewSwitcher;
