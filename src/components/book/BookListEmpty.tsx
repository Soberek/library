import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface BookListEmptyProps {
  message?: string;
}

/**
 * Component displayed when there are no books to show
 */
export const BookListEmpty: React.FC<BookListEmptyProps> = ({ 
  message = 'Brak książek do wyświetlenia.' 
}) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        py: 12, 
        px: 4,
        textAlign: 'center',
        bgcolor: 'background.default',
        borderRadius: 3,
        border: '2px dashed',
        borderColor: 'divider',
      }}
    >
      <MenuBookIcon 
        sx={{ 
          fontSize: 80, 
          color: 'text.disabled',
          mb: 2,
          opacity: 0.5,
        }} 
      />
      <Typography 
        variant="h6" 
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {message}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.disabled"
        sx={{ mt: 1 }}
      >
        Użyj przycisku "Dodaj książkę", aby rozpocząć
      </Typography>
    </Paper>
  );
};

