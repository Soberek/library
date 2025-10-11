import React from 'react';
import { Box, Button, ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ViewModule as GridViewIcon, ViewList as ViewListIcon } from '@mui/icons-material';

interface PageHeaderProps {
  onAddBook: () => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (newMode: 'cards' | 'table') => void;
  isFilterPanelOpen?: boolean;
  onFilterToggle?: () => void;
  title?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  onAddBook,
  viewMode,
  onViewModeChange,

}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Add safety check for SSR
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
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Title and Add Button Row */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Box display="flex" gap={1} alignItems="center">

          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddBook}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              px: { xs: 2, md: 3 },
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isMobile ? 'Dodaj' : 'Dodaj książkę'}
          </Button>
        </Box>
      </Box>

      {/* View Mode Toggle */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="widok książek"
          size="small"
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              padding: '6px 12px',
              '&.Mui-selected': { 
                backgroundColor: 'primary.light', 
                color: 'primary.contrastText',
                fontWeight: 500,
              },
            },
          }}
        >
          <ToggleButton value="cards">
            <GridViewIcon fontSize="small" sx={{ mr: 0.5 }} /> Karty
          </ToggleButton>
          <ToggleButton value="table">
            <ViewListIcon fontSize="small" sx={{ mr: 0.5 }} /> Tabela
          </ToggleButton>
        </ToggleButtonGroup>
        
        {/* Optional placeholder for additional controls */}
        <Box></Box>
      </Box>
    </Box>
  );
};

export default PageHeader;