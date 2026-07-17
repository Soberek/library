import React from "react";
import { Box, Typography, Button } from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import AddIcon from "@mui/icons-material/Add";

interface BookListEmptyProps {
  hasFilters?: boolean;
  onAddBook?: () => void;
  onClearFilters?: () => void;
}

export const BookListEmpty: React.FC<BookListEmptyProps> = ({
  hasFilters = false,
  onAddBook,
  onClearFilters,
}) => {
  const title = hasFilters
    ? "Brak książek pasujących do filtrów"
    : "Twoja biblioteka jest pusta";
  const subtitle = hasFilters
    ? "Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtry."
    : "Dodaj pierwszą książkę, aby zacząć śledzić swoją lekturę.";

  return (
    <Box
      sx={{
        py: { xs: 8, sm: 10 },
        px: 3,
        textAlign: "center",
        borderRadius: 3,
        border: "1px dashed",
        borderColor: "grey.300",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 2,
          mx: "auto",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(102, 126, 234, 0.08)",
          color: "primary.main",
        }}
      >
        <MenuBookOutlinedIcon sx={{ fontSize: 32 }} />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 360, mx: "auto" }}
      >
        {subtitle}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {hasFilters && onClearFilters && (
          <Button
            variant="outlined"
            startIcon={<FilterAltOffOutlinedIcon />}
            onClick={onClearFilters}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Wyczyść filtry
          </Button>
        )}
        {onAddBook && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddBook}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Dodaj książkę
          </Button>
        )}
      </Box>
    </Box>
  );
};
