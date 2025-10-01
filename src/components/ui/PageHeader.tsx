import React from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";

interface PageHeaderProps {
  isFilterPanelOpen: boolean;
  onFilterToggle: () => void;
  onAddBook: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  isFilterPanelOpen,
  onFilterToggle,
  onAddBook,
}) => {
  // Add safety check for SSR
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box display="flex" gap={2} sx={{ display: { xs: "none", md: "flex" } }}>
          <Tooltip title="Filtruj książki">
            <IconButton
              onClick={onFilterToggle}
              sx={{
                bgcolor: isFilterPanelOpen ? "rgba(102, 126, 234, 0.2)" : "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "&:hover": { bgcolor: isFilterPanelOpen ? "rgba(102, 126, 234, 0.3)" : "white" },
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddBook}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Dodaj książkę
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PageHeader;
