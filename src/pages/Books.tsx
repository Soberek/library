import React, { useCallback, useMemo } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { PageHeader } from "../components/ui";
import PageError from "../components/ui/PageError";
import {
  BookListEmpty,
  BookListLoading,
  BooksViewSwitcher,
  AddBookFab,
} from "../components/book";
import BookForm from "../components/forms/AddBookForm/BookForm";
import { useBooksQuery, useBookFilters } from "../hooks";
import CustomModal from "../components/ui/CustomModal";
import FilterStatisticsPanel from "../components/filters/FilterStatisticsPanel";
import { useFilterStore, useUIStore } from "../stores";
import type { Book } from "../types/Book";

const Books: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
  const activeFilters = useFilterStore((state) => state.activeFilters);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const storedViewMode = useUIStore((state) => state.viewMode);
  const setViewMode = useUIStore((state) => state.setViewMode);

  const [modalState, setModalState] = React.useState<{
    open: boolean;
    bookId: string | null;
  }>({ open: false, bookId: null });
  const [formDirty, setFormDirty] = React.useState(false);

  const viewMode = isMobile ? "cards" : storedViewMode;

  const editingBook = modalState.bookId
    ? books.find((book) => book.id === modalState.bookId)
    : undefined;

  const hasFilters = activeFilters > 0;

  const filteredReadCount = useMemo(
    () => filteredBooks.filter((b) => b.read === "Przeczytana").length,
    [filteredBooks],
  );

  const handleBookModalOpen = useCallback(
    ({ bookId }: { bookId: string | null }) => {
      setFormDirty(false);
      setModalState({ open: true, bookId });
    },
    [],
  );

  const handleBookModalClose = useCallback(() => {
    setFormDirty(false);
    setModalState({ open: false, bookId: null });
  }, []);

  const handleFormSubmit = useCallback(
    async (data: Book) => {
      if (modalState.bookId) {
        await handleBookUpdate(modalState.bookId, data);
      } else {
        await handleBookAdd(data);
      }
      handleBookModalClose();
    },
    [modalState.bookId, handleBookUpdate, handleBookAdd, handleBookModalClose],
  );

  const handleDelete = useCallback(
    async (bookId: string) => {
      if (modalState.bookId === bookId) {
        handleBookModalClose();
      }
      await handleBookDelete(bookId);
    },
    [modalState.bookId, handleBookDelete, handleBookModalClose],
  );

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <PageError message={error.message} />
      </Box>
    );
  }

  const modalTitle = modalState.bookId
    ? editingBook
      ? "Edytuj książkę"
      : "Książka niedostępna"
    : "Dodaj nową książkę";

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 10, md: 4 },
        width: "100%",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <PageHeader
          bookCount={loading ? 0 : filteredBooks.length}
          totalCount={loading ? 0 : books.length}
          readCount={loading ? 0 : filteredReadCount}
          onAddBook={() => handleBookModalOpen({ bookId: null })}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hideViewToggle={isMobile}
          hideAddButton={isMobile}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <FilterStatisticsPanel
          books={books}
          booksStats={booksStats}
          additionalStats={additionalStats}
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        {loading ? (
          <BookListLoading />
        ) : filteredBooks.length === 0 ? (
          <BookListEmpty
            hasFilters={hasFilters}
            onAddBook={() => handleBookModalOpen({ bookId: null })}
            onClearFilters={resetFilters}
          />
        ) : (
          <BooksViewSwitcher
            books={filteredBooks}
            viewMode={viewMode}
            onEdit={(id: string) => handleBookModalOpen({ bookId: id })}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onToggleFavorite={handleToggleFavorite}
            onRatingChange={handleRatingChange}
          />
        )}
      </Box>

      <AddBookFab onClick={() => handleBookModalOpen({ bookId: null })} />

      <CustomModal
        isOpen={modalState.open}
        onClose={handleBookModalClose}
        title={modalTitle}
        isDirty={formDirty}
      >
        {modalState.bookId && !editingBook ? (
          <PageError message="Ta książka nie istnieje lub została usunięta." />
        ) : (
          <BookForm
            key={modalState.bookId ?? "new"}
            initialData={editingBook || undefined}
            onSubmit={handleFormSubmit}
            onDirtyChange={setFormDirty}
          />
        )}
      </CustomModal>
    </Box>
  );
};

export default Books;
