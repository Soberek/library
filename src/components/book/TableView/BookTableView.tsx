import React from 'react';
import { Box, Paper, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import BookTable from './BookTable';
import type { Book, BookStatus } from '../../../types/Book';

interface BookTableViewProps {
  books: Book[];
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  onRatingChange?: (bookId: string, newRating: number) => void;
  // Pagination props
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

// Styled Load More Button
const LoadMoreButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 'auto'),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

/**
 * Table view for displaying books in a data table format
 * Provides a compact, information-dense view of books
 * Supports pagination with "Load More" button
 */
export const BookTableView: React.FC<BookTableViewProps> = ({
  books,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleFavorite,
  onRatingChange = () => {},
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
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
      
      {/* Load More Button */}
      {hasNextPage && fetchNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <LoadMoreButton
            variant="outlined"
            color="primary"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            size="large"
          >
            {isFetchingNextPage ? (
              <>
                <CircularProgress size={20} color="inherit" />
                Ładowanie...
              </>
            ) : (
              'Załaduj więcej książek'
            )}
          </LoadMoreButton>
        </Box>
      )}
      
      {/* Loading indicator */}
      {isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={30} />
        </Box>
      )}
    </Box>
  );
};

export default BookTableView;

