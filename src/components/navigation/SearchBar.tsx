import React from "react";
import { TextField, InputAdornment, Box, Fade } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSearch } from "../../hooks/useSearch";

interface SearchBarProps {
  variant?: "desktop" | "mobile";
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  variant = "desktop",
  placeholder = "Szukaj książek...",
}) => {
  const searchContext = useSearch();

  const isMobile = variant === "mobile";

  return (
    <Fade in timeout={1000}>
      <Box
        sx={{
          width: isMobile ? "100%" : { md: 400, lg: 500 },
          mx: isMobile ? 0 : 4,
        }}
      >
        <TextField
          value={searchContext?.searchTerm || ""}
          onChange={(e) => searchContext?.setSearchTerm(e.target.value)}
          placeholder={placeholder}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    color: isMobile
                      ? "rgba(255, 255, 255, 0.7)"
                      : "text.secondary",
                    fontSize: isMobile ? 20 : 22,
                  }}
                />
              </InputAdornment>
            ),
            sx: {
              bgcolor: isMobile
                ? "rgba(255, 255, 255, 0.4)"
                : "rgba(255, 255, 255, 0.95)",
              borderRadius: 3,
              backdropFilter: "blur(10px)",
              border: `1px solid ${isMobile ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.08)"}`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isMobile
                ? "0 4px 20px rgba(0, 0, 0, 0.1)"
                : "0 2px 12px rgba(0, 0, 0, 0.08)",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover": {
                bgcolor: isMobile
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(255, 255, 255, 0.98)",
                border: `1px solid ${isMobile ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.12)"}`,
                boxShadow: isMobile
                  ? "0 6px 24px rgba(0, 0, 0, 0.15)"
                  : "0 4px 16px rgba(0, 0, 0, 0.12)",
                transform: "translateY(-1px)",
              },
              "&.Mui-focused": {
                bgcolor: isMobile
                  ? "rgba(255, 255, 255, 0.6)"
                  : "rgba(255, 255, 255, 1)",
                border: `1px solid ${isMobile ? "rgba(255, 255, 255, 0.7)" : "primary.main"}`,
                boxShadow: isMobile
                  ? "0 0 0 2px rgba(255, 255, 255, 0.3)"
                  : `0 0 0 2px rgba(102, 126, 234, 0.2)`,
                transform: "translateY(-1px)",
              },
              "& input": {
                color: isMobile ? "white" : "text.primary",
                fontSize: isMobile ? "0.9rem" : "0.95rem",
                fontWeight: 500,
                "&::placeholder": {
                  color: isMobile
                    ? "rgba(255, 255, 255, 0.8)"
                    : "text.secondary",
                  opacity: 1,
                },
              },
            },
          }}
        />
      </Box>
    </Fade>
  );
};

export default SearchBar;
