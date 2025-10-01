import { useEffect, useMemo, useState, useCallback } from "react";
import { 
  BookList, 
  BottomNav, 
  ErrorDisplay, 
  LoadingSpinner, 
  FilterSortPanel,
  StatisticsDashboard,
  PageHeader,
  BookForms,
} from "../components";
import { useBooks } from "../hooks/useBooks";
import { useSearch } from "../hooks/useSearch";
import type { Book } from "../types/Book";
import { Box, Container } from "@mui/material";

const Books = () => {
  const {
    books,
    loading,
    error,
    booksStats,
    handleBookDelete,
    handleBookUpdate,
    handleStatusChange,
    handleBookSubmit,
    refetch,
  } = useBooks();

  const [isEditing, setIsEditing] = useState<{
    status: boolean;
    mode: "add" | "edit";
    bookId: string | null;
  }>({
    status: false,
    mode: "add",
    bookId: null,
  });

  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const searchContext = useSearch();

  useEffect(() => {
    // Check if document and body exist before manipulating styles
    if (typeof document !== 'undefined' && document.body) {
      if (isEditing.status) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }

    // Cleanup: restores scroll when the component is removed from the DOM
    return () => {
      if (typeof document !== 'undefined' && document.body) {
        document.body.style.overflow = "";
      }
    };
  }, [isEditing.status]);

  // Filter books based on searchTerm
  const searchFilteredBooks = useMemo(() => {
    if (searchContext?.searchTerm) {
      return filteredBooks.filter((book) =>
        book.title
          .toLowerCase()
          .includes(searchContext.searchTerm.toLowerCase()) ||
        book.author
          .toLowerCase()
          .includes(searchContext.searchTerm.toLowerCase())
      );
    }
    return filteredBooks;
  }, [filteredBooks, searchContext?.searchTerm]);

  // Update filtered books when books change
  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  // Calculate additional statistics
  const additionalStats = useMemo(() => {
    if (books.length === 0) return null;

    const totalPages = books.reduce((sum, book) => sum + Number(book.overallPages || 0), 0);
    const readPages = books.reduce((sum, book) => sum + Number(book.readPages || 0), 0);
    
    // Calculate average rating only from books with ratings > 0
    const booksWithRatings = books.filter(book => book.rating > 0);
    const averageRating = booksWithRatings.length > 0 
      ? booksWithRatings.reduce((sum, book) => sum + Number(book.rating), 0) / booksWithRatings.length 
      : 0;
    
    // Completion rate: percentage of books that are marked as "Przeczytana"
    const completionRate = booksStats.total > 0 ? (booksStats.read / booksStats.total) * 100 : 0;
    
    // Progress rate: percentage of pages read across all books
    const progressRate = totalPages > 0 ? (readPages / totalPages) * 100 : 0;

    return {
      totalPages,
      readPages,
      averageRating: Math.round(averageRating * 10) / 10,
      completionRate: Math.round(completionRate),
      progressRate: Math.round(progressRate),
    };
  }, [books, booksStats]);

  const handleBookModalOpen = useCallback(({
    bookId,
    mode,
  }: {
    bookId: string | null;
    mode: "add" | "edit";
  }) => {
      setIsEditing({
        mode: mode,
        status: true,
        bookId: bookId,
      });
  }, []);

  const handleBookModalClose = useCallback(() => {
    setIsEditing((prev) => ({ ...prev, status: false }));
  }, []);

  if (loading) {
    return <LoadingSpinner message="Ładowanie książek..." fullScreen />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 2,
      }}
    >
      <Container maxWidth="xl">
        <ErrorDisplay error={error} onRetry={refetch} />
        
        {/* Page Header */}
        <PageHeader
          isFilterPanelOpen={isFilterPanelOpen}
          onFilterToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          onAddBook={() => handleBookModalOpen({ mode: "add", bookId: null })}
        />

        {/* Statistics Dashboard */}
        {booksStats.total > 0 && additionalStats && (
          <StatisticsDashboard
            booksStats={booksStats}
            additionalStats={additionalStats}
          />
        )}

        {/* Filter and Sort Panel */}
        {books.length > 0 && (
          <FilterSortPanel
            books={books}
            onFilterChange={setFilteredBooks}
            isOpen={isFilterPanelOpen}
            onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          />
        )}

        {/* Book Forms */}
        <BookForms
          isEditing={isEditing}
          books={books}
          handleBookSubmit={handleBookSubmit}
          handleBookUpdate={handleBookUpdate}
          handleBookModalOpen={handleBookModalOpen}
          handleBookModalClose={handleBookModalClose}
        />

        {/* Books List */}
        <Box>
          <BookList
            loading={loading}
            books={searchFilteredBooks}
            handleStatusChange={handleStatusChange}
            handleBookUpdate={handleBookUpdate}
            handleBookDelete={handleBookDelete}
            handleBookModalOpen={handleBookModalOpen}
          />
        </Box>

        {/* Fixed add book button */}
        <BottomNav handleBookModalOpen={handleBookModalOpen} />
      </Container>
    </Box>
  );
};

export default Books;
