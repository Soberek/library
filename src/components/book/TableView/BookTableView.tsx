import React from "react";
import BookTable from "./BookTable";
import type { Book, BookStatus } from "../../../types/Book";
import { Card } from "../../ui/card";

interface BookTableViewProps {
  books: Book[];
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  onRatingChange?: (bookId: string, newRating: number) => void;
  onPagesChange?: (bookId: string, newReadPages: number, overallPages?: number) => void;
}

export const BookTableView: React.FC<BookTableViewProps> = ({
  books,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleFavorite,
  onRatingChange = () => {},
  onPagesChange,
}) => {
  return (
    <Card className="overflow-hidden shadow-sm border-slate-200/90 rounded-2xl">
      <BookTable
        books={books}
        handleEdit={onEdit}
        handleDelete={onDelete}
        handleStatusChange={onStatusChange}
        handleRatingChange={onRatingChange}
        handleToggleFavorite={onToggleFavorite}
        handlePagesChange={onPagesChange}
      />
    </Card>
  );
};

export default BookTableView;
