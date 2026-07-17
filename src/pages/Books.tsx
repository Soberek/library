import React, { useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { PageHeader } from "../components/ui";
import {
  BookListEmpty,
  BookListLoading,
  BooksViewSwitcher,
} from "../components/book";
import BookForm from "../components/forms/AddBookForm/BookForm";
import { useBooksQuery, useBookFilters } from "../hooks";
import CustomModal from "../components/ui/CustomModal";
import FilterStatisticsPanel from "../components/filters/FilterStatisticsPanel";
import type { Book } from "../types/Book";

const Books: React.FC = () => {
  // Hooks
  const {
    books,
    loading,
    error,
    booksStats,
    additionalStats,
    handleBookAdd,
    handleBookUpdate,
    handleBookDelete,
    handleStatusChange,
    handleToggleFavorite,
    handleRatingChange,
  } = useBooksQuery(false);

  const filteredBooks = useBookFilters(books);

  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Computed values
  const editingBook = editingBookId
    ? books.find((book) => book.id === editingBookId)
    : undefined;

  // Callbacks
  const handleBookModalOpen = useCallback(
    ({ bookId }: { bookId: string | null }) => {
      setEditingBookId(bookId);
      setIsModalOpen(true);
    },
    [],
  );

  const handleBookModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingBookId(null);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: Book) => {
      if (editingBookId) {
        await handleBookUpdate(editingBookId, data);
      } else {
        await handleBookAdd(data);
      }
      handleBookModalClose();
    },
    [editingBookId, handleBookUpdate, handleBookAdd, handleBookModalClose],
  );

  const handleFilterPanelToggle = useCallback(() => {
    setIsFilterPanelOpen((prev) => !prev);
  }, []);

  // Error handling
  if (error)
    return <Typography color="error">Błąd: {error.message}</Typography>;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        width: "100%",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <PageHeader
          bookCount={loading ? 0 : filteredBooks.length}
          readCount={booksStats.read}
          onAddBook={() => handleBookModalOpen({ bookId: null })}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <FilterStatisticsPanel
          books={books}
          isFilterOpen={isFilterPanelOpen}
          onFilterToggle={handleFilterPanelToggle}
          booksStats={booksStats}
          additionalStats={additionalStats}
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        {loading ? (
          <BookListLoading />
        ) : filteredBooks.length === 0 ? (
          <BookListEmpty />
        ) : (
          <BooksViewSwitcher
            books={filteredBooks}
            viewMode={viewMode}
            onEdit={(id: string) => handleBookModalOpen({ bookId: id })}
            onDelete={handleBookDelete}
            onStatusChange={handleStatusChange}
            onToggleFavorite={handleToggleFavorite}
            onRatingChange={handleRatingChange}
          />
        )}
      </Box>

      <CustomModal
        isOpen={isModalOpen}
        onClose={handleBookModalClose}
        title={editingBookId ? "Edytuj książkę" : "Dodaj nową książkę"}
      >
        <BookForm
          initialData={editingBook || undefined}
          onSubmit={handleFormSubmit}
          onClose={handleBookModalClose}
        />
      </CustomModal>
    </Box>
  );
};

export default Books;
