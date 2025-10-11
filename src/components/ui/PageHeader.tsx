import React from 'react';
import { Box, Button, ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ViewModule as GridViewIcon, ViewList as ViewListIcon } from '@mui/icons-material';

interface PageHeaderProps {
  onAddBook: () => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (newMode: 'cards' | 'table') => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  onAddBook,
  viewMode,
  onViewModeChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: 'cards' | 'table' | null) => {
    if (newMode !== null) {
      onViewModeChange(newMode);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 2,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {/* Add Button */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddBook}
        size="large"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          px: { xs: 3, md: 4 },
          py: 1.5,
          fontWeight: 600,
          textTransform: 'none',
          fontSize: { xs: '0.875rem', md: '1rem' },
          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        Dodaj książkę
      </Button>

      {/* View Mode Toggle */}
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewModeChange}
        aria-label="widok książek"
        size={isMobile ? 'small' : 'medium'}
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
          '& .MuiToggleButton-root': {
            textTransform: 'none',
            px: { xs: 2, md: 3 },
            py: 1,
            fontWeight: 500,
            border: 'none',
            '&.Mui-selected': { 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            },
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
        }}
      >
        <ToggleButton value="cards">
          <GridViewIcon fontSize="small" sx={{ mr: { xs: 0, sm: 0.5 } }} />
          {!isMobile && 'Siatka'}
        </ToggleButton>
        <ToggleButton value="table">
          <ViewListIcon fontSize="small" sx={{ mr: { xs: 0, sm: 0.5 } }} />
          {!isMobile && 'Tabela'}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default PageHeader;