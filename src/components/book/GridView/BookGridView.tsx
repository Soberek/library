import React, { useEffect, useRef } from 'react';
import { Box, Grid, Zoom, Fade, Button, CircularProgress } from '@mui/material';
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
  
  // Pagination props
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  enableInfiniteScroll?: boolean;
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

// Load more button styled component
const LoadMoreButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 'auto'),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

/**
 * Grid view for displaying books as cards
 * Uses Material-UI Grid for responsive layout with enhanced animations
 * Supports pagination with "Load More" button or infinite scroll
 */
export const BookGridView: React.FC<BookGridViewProps> = ({
  books,
  onEdit,
  onDelete,
  onStatusChange,
  onShare,
  onToggleFavorite,
  onRatingChange,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  enableInfiniteScroll = false,
}) => {
  // Reference for infinite scroll detection
  const bottomObserverRef = useRef<HTMLDivElement>(null);

  // Implement infinite scroll using Intersection Observer
  useEffect(() => {
    if (!enableInfiniteScroll || !hasNextPage || !fetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const currentObserver = bottomObserverRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [enableInfiniteScroll, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
      
      {/* Load More Button (shown only if not using infinite scroll) */}
      {hasNextPage && fetchNextPage && !enableInfiniteScroll && (
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
                Laden...
              </>
            ) : (
              'Mehr Bücher laden'
            )}
          </LoadMoreButton>
        </Box>
      )}
      
      {/* Invisible element for infinite scroll detection */}
      {enableInfiniteScroll && hasNextPage && (
        <Box ref={bottomObserverRef} sx={{ height: '20px', width: '100%' }} />
      )}
      
      {/* Loading indicator for infinite scroll */}
      {enableInfiniteScroll && isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={30} />
        </Box>
      )}
    </GridContainer>
  );
};

export default BookGridView;