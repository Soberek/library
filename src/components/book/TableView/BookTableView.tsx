import React from "react";
import { Box, Paper } from "@mui/material";
import BookTable from "./BookTable";
import type { Book, BookStatus } from "../../../types/Book";

interface BookTableViewProps {
  books: Book[];
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  onRatingChange?: (bookId: string, newRating: number) => void;
}

/**
 * Table view for displaying books in a data table format
 * Provides a compact, information-dense view of books
 */
export const BookTableView: React.FC<BookTableViewProps> = ({
  books,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleFavorite,
  onRatingChange = () => {},
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <BookTable
          books={books}
          handleEdit={onEdit}
          handleDelete={onDelete}
          handleStatusChange={onStatusChange}
          handleRatingChange={onRatingChange}
          handleToggleFavorite={onToggleFavorite}
        />
      </Paper>
    </Box>
  );
};

export default BookTableView;
