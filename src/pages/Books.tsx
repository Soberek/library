import React, { useCallback, useMemo, useState } from "react";
import { PageHeader } from "../components/ui";
import PageError from "../components/ui/PageError";
import {
  BookListEmpty,
  BookListLoading,
  BooksViewSwitcher,
  AddBookFab,
  ExportImportModal,
} from "../components/book";
import BookForm from "../components/forms/AddBookForm/BookForm";
import { useBooksQuery, useBookFilters } from "../hooks";
import CustomModal from "../components/ui/CustomModal";
import FilterStatisticsPanel from "../components/filters/FilterStatisticsPanel";
import { useFilterStore, useUIStore } from "../stores";
import type { Book } from "../types/Book";

export const Books: React.FC = () => {
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
    handlePagesChange,
  } = useBooksQuery(false);

  const filteredBooks = useBookFilters(books);
  const activeFilters = useFilterStore((state) => state.activeFilters);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const storedViewMode = useUIStore((state) => state.viewMode);
  const setViewMode = useUIStore((state) => state.setViewMode);

  const [modalState, setModalState] = useState<{
    open: boolean;
    bookId: string | null;
  }>({ open: false, bookId: null });
  const [exportImportOpen, setExportImportOpen] = useState(false);
  const [formDirty, setFormDirty] = useState(false);

  const viewMode = storedViewMode;

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

  const handleImportBooks = useCallback(
    async (importedBooks: Omit<Book, 'id'>[]) => {
      let count = 0;
      for (const item of importedBooks) {
        await handleBookAdd(item as Book);
        count++;
      }
      return count;
    },
    [handleBookAdd],
  );

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <PageError message={error.message} />
      </div>
    );
  }

  const modalTitle = modalState.bookId
    ? editingBook
      ? "Edytuj książkę"
      : "Książka niedostępna"
    : "Dodaj nową książkę";

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8 w-full min-h-[calc(100vh-64px)] space-y-6">
      <PageHeader
        bookCount={loading ? 0 : filteredBooks.length}
        totalCount={loading ? 0 : books.length}
        readCount={loading ? 0 : filteredReadCount}
        onAddBook={() => handleBookModalOpen({ bookId: null })}
        onExportImport={() => setExportImportOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <FilterStatisticsPanel
        books={books}
        booksStats={booksStats}
        additionalStats={additionalStats}
      />

      <div className="w-full">
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
            onPagesChange={handlePagesChange}
          />
        )}
      </div>

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

      <ExportImportModal
        open={exportImportOpen}
        onClose={() => setExportImportOpen(false)}
        books={books}
        onImportBooks={handleImportBooks}
      />
    </div>
  );
};

export default Books;
