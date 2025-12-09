import React from 'react';
import { Box, Grid, Zoom, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import BookCard from './BookCard';
import type { Book, BookStatus } from '../../../types/Book';

interface BookGridViewProps {
  books: Book[];
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onShare?: (book: Book) => void;
  onToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  onRatingChange?: (bookId: string, newRating: number) => void;
}

// Styled Components
const GridContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '400px',
  position: 'relative',
  padding: theme.spacing(1),
}));

const CardWrapper = styled(Box)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    zIndex: 2,
  },
}));

/**
 * Grid view for displaying books as cards
 * Uses Material-UI Grid for responsive layout with enhanced animations
 */
export const BookGridView: React.FC<BookGridViewProps> = ({
  books,
  onEdit,
  onDelete,
  onStatusChange,
  onShare,
  onToggleFavorite,
  onRatingChange,
}) => {
  return (
    <GridContainer>
      <Grid 
        container 
        spacing={1}
        sx={{
          margin: 0,
          width: '100%',
        }}
      >
        {books.map((book, index) => (
          <Grid 
            item 
            key={book.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            sx={{
              display: 'flex',
              padding: { xs: 1, sm: 1.5, md: 2 },
            }}
          >
            <Zoom 
              in={true} 
              timeout={500}
              style={{ 
                transitionDelay: `${Math.min(index * 50, 800)}ms`,
                width: '100%',
              }}
            >
              <CardWrapper>
                <Fade 
                  in={true} 
                  timeout={1000}
                  style={{ 
                    transitionDelay: `${Math.min(index * 50 + 100, 900)}ms`,
                  }}
                >
                  <Box sx={{ width: '100%', height: '100%' }}>
                    <BookCard
                      book={book}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                      onShare={onShare}
                      onToggleFavorite={onToggleFavorite}
                      onRatingChange={onRatingChange}
                    />
                  </Box>
                </Fade>
              </CardWrapper>
            </Zoom>
          </Grid>
        ))}
      </Grid>
    </GridContainer>
  );
};

export default BookGridView;