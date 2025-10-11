import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { formatBookCount } from '../../utils/textHelpers';

interface BooksHeaderProps {
  bookCount: number;
  onAddBook: () => void;
}

/**
 * Header section for the books list with add button and count
 */
export const BooksHeader: React.FC<BooksHeaderProps> = ({ bookCount, onAddBook }) => {
  return (
    <Box 
      sx={{ 
        mb: { xs: 2, sm: 3 }, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
        p: { xs: 2, sm: 0 },
        borderRadius: { xs: 2, sm: 0 },
        bgcolor: { xs: 'background.paper', sm: 'transparent' },
      }}
    >
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddBook}
        size="large"
        sx={{ 
          px: 4,
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: 2,
          '&:hover': {
            boxShadow: 4,
          },
        }}
      >
        Dodaj książkę
      </Button>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: { xs: 'center', sm: 'flex-end' },
        px: { xs: 0, sm: 2 },
        py: { xs: 0, sm: 1 },
        borderRadius: 2,
        bgcolor: { xs: 'transparent', sm: 'action.hover' },
      }}>
        <Typography 
          variant="body1" 
          color="text.primary"
          sx={{ 
            fontWeight: 500,
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          {formatBookCount(bookCount)}
        </Typography>
      </Box>
    </Box>
  );
};

