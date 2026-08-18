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
  onPagesChange?: (bookId: string, newReadPages: number, overallPages?: number) => void;
}

export const BooksViewSwitcher: React.FC<BooksViewSwitcherProps> = ({
  books,
  viewMode,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleFavorite,
  onRatingChange,
  onPagesChange,
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
        onPagesChange={onPagesChange}
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
      onPagesChange={onPagesChange}
    />
  );
};


export default BooksViewSwitcher;
