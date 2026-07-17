import React from "react";
import {
  TextField,
  InputAdornment,
  Box,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useFilterStore } from "../../stores";

interface SearchBarProps {
  variant?: "desktop" | "mobile";
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  variant = "desktop",
  placeholder = "Szukaj książek...",
}) => {
  const searchTerm = useFilterStore((state) => state.filters.searchTerm);
  const setFilter = useFilterStore((state) => state.setFilter);
  const isMobile = variant === "mobile";

  const clearSearch = () => setFilter("searchTerm", "");

  return (
    <Box sx={{ width: "100%", maxWidth: isMobile ? "100%" : 520 }}>
      <TextField
        value={searchTerm}
        onChange={(e) => setFilter("searchTerm", e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && searchTerm) {
            e.preventDefault();
            clearSearch();
          }
        }}
        placeholder={placeholder}
        variant="outlined"
        size="small"
        fullWidth
        inputProps={{
          "aria-label": "Szukaj książek",
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  color: "text.secondary",
                  fontSize: 20,
                }}
              />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label="Wyczyść wyszukiwanie"
                onClick={clearSearch}
                edge="end"
              >
                <ClearIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </InputAdornment>
          ) : undefined,
          sx: {
            bgcolor: "grey.50",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200",
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&:hover": {
              bgcolor: "background.paper",
              borderColor: "grey.300",
            },
            "&.Mui-focused": {
              bgcolor: "background.paper",
              borderColor: "primary.main",
              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.12)",
            },
            "& input": {
              fontSize: "0.875rem",
              fontWeight: 500,
              py: 1,
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
