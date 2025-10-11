import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Chip, 
  Box,
  IconButton,
  LinearProgress,
  Tooltip,
  Stack,
  alpha,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button as MuiButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { BookActions } from './';
import type { Book, BookStatus } from '../../../types/Book';
import SpecialButton from '../../../components/ui/SpecialButton';

interface BookCardProps {
  book: Book;
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onShare?: (book: Book) => void;
  onToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  onRatingChange?: (bookId: string, newRating: number) => void;
}

// Status color mapping
const statusColors: Record<BookStatus, { bg: string; text: string }> = {
  'Chcę przeczytać': { bg: '#3b82f6', text: '#fff' },
  'W trakcie': { bg: '#fbbf24', text: '#fff' },
  'Przeczytana': { bg: '#10b981', text: '#fff' },
  'Porzucona': { bg: '#ef4444', text: '#fff' },
};

// Consolidate background logic to fix duplicate property error
// Replace the entire StyledCard definition with this fixed version

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isFavorite' && prop !== 'isHovered',
})<{ isFavorite?: boolean; isHovered?: boolean }>(({ isFavorite, isHovered }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  borderRadius: 20,
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: 'none',
  
  // Base background (no changes, no overlay)
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  
  // existing boxShadow, transform...
  
  // Enhance to bigger premium VIP golden border
  ...(isFavorite && {
    // Thicker main border for VIP
    border: '3px solid #FFD700', // Thicker for premium feel
    
    // Remove ::after goldenFlow
  }),
  
  // Faster/more dynamic on hover
  ...(isFavorite && isHovered && {
    // Remove ::after goldenFlow
  }),
  

  
  // Enhance pulsing effect in goldenPulse keyframes

  // Remove shimmerGolden entirely (too visible for "just border")
  // No @keyframes shimmerGolden or references to it
}));

const CoverContainer = styled(Box)(() => ({
  position: 'relative',
  height: 260,
  overflow: 'hidden',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  backgroundColor: '#f8fafc',
}));

const StatusBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: string }>(({ status }) => {
  let gradient = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
  
  if (status === 'Przeczytana') {
    gradient = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  } else if (status === 'W trakcie') {
    gradient = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
  } else if (status === 'Porzucona') {
    gradient = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
  }
  
  return {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    background: gradient,
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.7rem',
    padding: '6px 14px',
    borderRadius: 50,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
    },
  };
});

const ActionButtons = styled(Box)(() => ({
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}));

const ActionButton = styled(IconButton)(() => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  width: 42,
  height: 42,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.15) rotate(5deg)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
  },
}));


const NoCoverPlaceholder = styled(Box)(() => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'float 8s ease-in-out infinite',
  },
  
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translate(0, 0) rotate(0deg)',
    },
    '33%': {
      transform: 'translate(30px, -30px) rotate(120deg)',
    },
    '66%': {
      transform: 'translate(-20px, 20px) rotate(240deg)',
    },
  },
}));



const BookCard: React.FC<BookCardProps> = ({ 
  book, onEdit, onDelete, onToggleFavorite, onRatingChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const isFavorite = book.isFavorite;
  const progress = Math.min(((book.readPages ?? 0) / (book.overallPages ?? 1)) * 100, 100);

  const handleRatingClick = (rating: number) => {
    if (onRatingChange) {
      onRatingChange(book.id, rating);
    }
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setBookToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (bookToDelete) {
      onDelete(bookToDelete);
    }
    setOpenDeleteDialog(false);
    setBookToDelete(null);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setBookToDelete(null);
  };

  return (
    <StyledCard
      isFavorite={isFavorite}
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Book Cover */}
      <CoverContainer>
        {book.cover ? (
          <CardMedia
            component="img"
            image={book.cover}
            alt={book.title}
            sx={{
              height: '100%',
              width: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        ) : (
          <NoCoverPlaceholder>
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <MenuBookIcon
                sx={{
                  fontSize: 80,
                  color: 'rgba(255, 255, 255, 0.9)',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                  animation: 'bookFloat 3s ease-in-out infinite',
                  '@keyframes bookFloat': {
                    '0%, 100%': {
                      transform: 'translateY(0px)',
                    },
                    '50%': {
                      transform: 'translateY(-10px)',
                    },
                  },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '0.5px',
                }}
              >
                Brak okładki
              </Typography>
              <Box
                sx={{
                  width: 40,
                  height: 3,
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 2,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              />
            </Box>
          </NoCoverPlaceholder>
        )}
        
        {/* Status Badge */}
        <StatusBadge status={book.read}>
          {book.read}
        </StatusBadge>
        
        {/* Bookmark and Share Buttons */}
        <ActionButtons>
          <Tooltip title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'} arrow>
            <ActionButton
              onClick={() => onToggleFavorite(book.id, book.isFavorite!)}
              sx={{
                ...(isFavorite && {
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  boxShadow: '0 4px 16px rgba(251, 191, 36, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    boxShadow: '0 6px 24px rgba(251, 191, 36, 0.5)',
                    transform: 'scale(1.15) rotate(-5deg)',
                  },
                }),
              }}
            >
              {isFavorite ? (
                <StarIcon 
                  sx={{ 
                    color: '#ffffff', 
                    fontSize: 24, 
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                    transition: 'all 0.3s ease',
                  }} 
                />
              ) : (
                <StarBorderIcon 
                  sx={{ 
                    color: '#64748b', 
                    fontSize: 24, 
                    transition: 'all 0.3s ease',
                  }} 
                />
              )}
            </ActionButton>
          </Tooltip>
        </ActionButtons>

        {/* Add golden favorite badge in CoverContainer (after StatusBadge) */}
    
      </CoverContainer>

      {/* Book Details */}
      <CardContent sx={{ 
        p: 2.5, 
        pt: 2.5, 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(248,250,252,0.5) 100%)',
      }}>
        {/* Title and Author */}
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 800,
            fontSize: '1.15rem',
            mb: 0.5,
            color: '#0f172a',
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {book.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 2.5, 
            color: '#64748b',
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            '&::before': {
              content: '"✍️"',
              fontSize: '0.85rem',
            },
          }}
        >
          {book.author}
        </Typography>

        {/* Progress Section */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#64748b',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              POSTĘP
            </Typography>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              }}
            >
              {book.readPages} / {book.overallPages}
            </Box>
          </Box>
          
          <Box sx={{ position: 'relative', mb: 0.5 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e2e8f0',
                overflow: 'hidden',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%)',
                  borderRadius: 4,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite linear',
                },
                '@keyframes shimmer': {
                  '0%': {
                    backgroundPosition: '200% 0',
                  },
                  '100%': {
                    backgroundPosition: '-200% 0',
                  },
                },
              }}
            />
          </Box>
          
          <Typography 
            variant="caption" 
            sx={{ 
              textAlign: 'right',
              color: '#6366f1',
              fontWeight: 600,
              display: 'block',
              fontSize: '0.75rem',
            }}
          >
            {Math.round(progress)}% ukończone
          </Typography>
        </Box>

        {/* Rating Section */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#64748b',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              OCENA
            </Typography>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)',
              }}
            >
              {hoveredRating ?? book.rating}/10
            </Box>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: 0.3,
              padding: '8px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              transition: 'all 0.3s ease',
            }}
            onMouseLeave={() => setHoveredRating(null)}
          >
            {Array.from({ length: 10 }).map((_, i) => {
              const isActive = hoveredRating !== null 
                ? i < hoveredRating 
                : i < Math.floor(book.rating);
              
              return (
                <Box 
                  key={i} 
                  onClick={() => handleRatingClick(i + 1)}
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  sx={{ 
                    display: 'flex',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    filter: isActive ? 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.4))' : 'none',
                    '&:hover': {
                      transform: 'scale(1.25) rotate(-5deg)',
                      filter: 'drop-shadow(0 4px 8px rgba(251, 191, 36, 0.6))',
                    },
                  }}
                >
                  {isActive ? (
                    <StarIcon 
                      sx={{ 
                        fontSize: 18,
                        color: '#fbbf24',
                        transition: 'all 0.2s ease',
                      }} 
                    />
                  ) : (
                    <StarBorderIcon 
                      sx={{ 
                        fontSize: 18,
                        color: '#cbd5e1',
                        transition: 'all 0.2s ease',
                      }} 
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ mt: 'auto', display: 'flex', gap: 1.5 }}>
           {/* Delete Button */}
           {book.isFavorite ? (
             <SpecialButton 
               specialVariant="gradient"
               onClick={() => handleDeleteClick(book.id)} 
               sx={{ flex: 1 }}
             >
               Usuń
             </SpecialButton>
           ) : (
            // Original delete Box
            <Box 
              component="button"
              onClick={() => handleDeleteClick(book.id)}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                py: 1.2,
                border: book.isFavorite ? 'none' : '2px solid #ef4444',
                borderRadius: 2.5,
                background: book.isFavorite 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                  : 'transparent',
                color: book.isFavorite ? '#fff' : '#ef4444',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: book.isFavorite 
                    ? 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.2), transparent)' 
                    : 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), transparent)',
                  transition: 'left 0.5s ease',
                },
                '&:hover': {
                  background: book.isFavorite 
                    ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' 
                    : 'alpha(#ef4444, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: book.isFavorite 
                    ? '0 4px 12px rgba(239, 68, 68, 0.3)' 
                    : '0 4px 12px rgba(239, 68, 68, 0.3)',
                  borderColor: book.isFavorite ? '#b91c1c' : '#dc2626',
                  '&::before': {
                    left: '100%',
                  },
                  animation: book.isFavorite ? 'redPulse 2s infinite' : 'none',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              Usuń
            </Box>
          )}
          
           {/* Edit Button */}
           {book.isFavorite ? (
             <SpecialButton 
               specialVariant="gradient"
               onClick={() => onEdit(book.id)} 
               sx={{ flex: 1 }}
             >
               Edytuj
             </SpecialButton>
           ) : (
            // Original edit Box
            <Box 
              component="button"
              onClick={() => onEdit(book.id)}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                py: 1.2,
                border: 'none',
                borderRadius: 2.5,
                background: book.isFavorite 
                  ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' 
                  : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: book.isFavorite 
                  ? '0 4px 12px rgba(255, 215, 0, 0.3)' 
                  : '0 4px 12px rgba(99, 102, 241, 0.3)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: book.isFavorite 
                    ? 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)' 
                    : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transition: 'left 0.5s ease',
                },
                '&:hover': {
                  background: book.isFavorite 
                    ? 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)' 
                    : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: book.isFavorite 
                    ? '0 6px 20px rgba(255, 215, 0, 0.4)' 
                    : '0 6px 20px rgba(99, 102, 241, 0.4)',
                  '&::before': {
                    left: '100%',
                  },
                  animation: book.isFavorite ? 'goldPulse 2s infinite' : 'none',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              Edytuj
            </Box>
          )}
        </Box>
      </CardContent>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Potwierdź usunięcie
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Czy na pewno chcesz usunąć tę książkę? Tej operacji nie można cofnąć.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseDialog} color="primary">
            Anuluj
          </MuiButton>
          <MuiButton onClick={handleConfirmDelete} color="error" autoFocus>
            Usuń
          </MuiButton>
        </DialogActions>
      </Dialog>
    </StyledCard>
  );
};

export default BookCard;

// Move keyframes inside StyledCard to fix lint/parsing error

