import React from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';

interface BookListLoadingProps {
  message?: string;
}

/**
 * Component displayed while books are loading
 */
export const BookListLoading: React.FC<BookListLoadingProps> = ({ 
  message = 'Ładowanie książek...' 
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
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {message}
        </Typography>
      </Box>
    </Paper>
  );
};

