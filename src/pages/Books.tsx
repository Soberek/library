import React, { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeader } from '../components/ui';
import { BookList } from '../components/book';
import BookForm from '../components/forms/AddBookForm/BookForm';
import { useBooks } from '../hooks/useBooks';
import CustomModal from '../components/ui/CustomModal';
import FilterStatisticsPanel from '../components/filters/FilterStatisticsPanel';
import type { Book } from '../types/Book';
import BookTable from '../components/book/BookTable';

const Books: React.FC = () => {
  const { 
    books, loading, error, booksStats, additionalStats,
    handleBookAdd, handleBookUpdate, handleBookDelete, handleStatusChange, handleToggleFavorite,
  } = useBooks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Update filteredBooks when books or filters change
  React.useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  const handleBookModalOpen = ({ bookId }: { bookId: string | null }) => {
    setEditingBookId(bookId);
    setIsModalOpen(true);
  };

  const handleBookModalClose = () => {
    setIsModalOpen(false);
    setEditingBookId(null);
  };

  const handleFormSubmit = async (data: Book) => {
    if (editingBookId) {
      await handleBookUpdate(editingBookId, data);
    } else {
      await handleBookAdd(data);
    }
    handleBookModalClose();
  };

  const editingBook = editingBookId
    ? books.find((book) => book.id === editingBookId)
    : undefined;

  const handleFilterPanelToggle = () => {
    setIsFilterPanelOpen((prev) => !prev);
  };

  const handleFilterChange = (newFilteredBooks: Book[]) => {
    setFilteredBooks(newFilteredBooks);
  };

  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader 
        title="Moje Książki"
        onAddBook={() => handleBookModalOpen({ bookId: null })}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={4}>
          <FilterStatisticsPanel
            books={books} // Pass the original books to the filter panel
            onFilterChange={handleFilterChange}
            isFilterOpen={isFilterPanelOpen}
            onFilterToggle={handleFilterPanelToggle}
            booksStats={booksStats}
            additionalStats={additionalStats}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleBookModalOpen({ bookId: null })}
            >
              Dodaj książkę
            </Button>
          </Box>

          {loading ? (
            <Typography>Ładowanie książek...</Typography>
          ) : filteredBooks.length === 0 ? (
            <Typography>Brak książek do wyświetlenia.</Typography>
          ) : (
            viewMode === 'cards' ? (
              <BookList
                books={filteredBooks}
                onEdit={(id: string) => handleBookModalOpen({ bookId: id })}
                onDelete={handleBookDelete}
                onStatusChange={handleStatusChange}
                onToggleFavorite={handleToggleFavorite}
              />
            ) : (
              <BookTable
                books={filteredBooks}
                handleEdit={(id: string) => handleBookModalOpen({ bookId: id })}
                handleDelete={handleBookDelete}
                handleStatusChange={handleStatusChange}
                handleRatingChange={() => {}}
                handleToggleFavorite={handleToggleFavorite}
              />
            )
          )}
        </Grid>
      </Grid>

      <CustomModal isOpen={isModalOpen} onClose={handleBookModalClose} title={editingBookId ? 'Edytuj książkę' : 'Dodaj nową książkę'}>
        <BookForm 
          initialData={editingBook || undefined }
          onSubmit={handleFormSubmit}
          onClose={handleBookModalClose}
        />
      </CustomModal>
    </Box>
  );
};

export default Books;
