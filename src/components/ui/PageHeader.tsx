import React from "react";
import {
  Box,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  ViewModule as GridViewIcon,
  ViewList as ViewListIcon,
} from "@mui/icons-material";
import { formatBookCount } from "../../utils/textHelpers";

interface PageHeaderProps {
  title?: string;
  bookCount: number;
  totalCount?: number;
  readCount?: number;
  onAddBook: () => void;
  viewMode: "cards" | "table";
  onViewModeChange: (newMode: "cards" | "table") => void;
  hideViewToggle?: boolean;
  hideAddButton?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title = "Moje Książki",
  bookCount,
  totalCount,
  readCount,
  onAddBook,
  viewMode,
  onViewModeChange,
  hideViewToggle = false,
  hideAddButton = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "cards" | "table" | null,
  ) => {
    if (newMode !== null) {
      onViewModeChange(newMode);
    }
  };

  const countLabel =
    typeof totalCount === "number" && totalCount !== bookCount
      ? `${formatBookCount(bookCount)} z ${totalCount}`
      : formatBookCount(bookCount);

  const subtitleParts = [countLabel];
  if (typeof readCount === "number") {
    subtitleParts.push(
      `${readCount} ${readCount === 1 ? "przeczytana" : "przeczytanych"}`,
    );
  }

  if (hideViewToggle && hideAddButton) {
    return (
      <Box
        component="header"
        sx={{
          pb: 2.5,
          mb: 1,
          borderBottom: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Typography
          variant="overline"
          sx={{
            display: "block",
            color: "primary.main",
            fontWeight: 700,
            letterSpacing: "0.12em",
            fontSize: "0.6875rem",
            mb: 0.5,
            lineHeight: 1.2,
          }}
        >
          Kolekcja
        </Typography>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            letterSpacing: "-0.03em",
            fontSize: { xs: "1.75rem", sm: "2rem" },
            lineHeight: 1.15,
            mb: 0.75,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            fontSize: "0.875rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 0.75,
          }}
        >
          {subtitleParts.map((part, index) => (
            <React.Fragment key={part}>
              {index > 0 && (
                <Box
                  component="span"
                  sx={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    bgcolor: "grey.400",
                    flexShrink: 0,
                  }}
                />
              )}
              <Box component="span">{part}</Box>
            </React.Fragment>
          ))}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "flex-end" },
        justifyContent: "space-between",
        gap: { xs: 2.5, md: 3 },
        pb: 2.5,
        mb: 1,
        borderBottom: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="overline"
          sx={{
            display: "block",
            color: "primary.main",
            fontWeight: 700,
            letterSpacing: "0.12em",
            fontSize: "0.6875rem",
            mb: 0.5,
            lineHeight: 1.2,
          }}
        >
          Kolekcja
        </Typography>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            letterSpacing: "-0.03em",
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
            lineHeight: 1.15,
            mb: 0.75,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            fontSize: "0.875rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 0.75,
          }}
        >
          {subtitleParts.map((part, index) => (
            <React.Fragment key={part}>
              {index > 0 && (
                <Box
                  component="span"
                  sx={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    bgcolor: "grey.400",
                    flexShrink: 0,
                  }}
                />
              )}
              <Box component="span">{part}</Box>
            </React.Fragment>
          ))}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          flexShrink: 0,
          alignSelf: { xs: "stretch", sm: "flex-start", md: "flex-end" },
        }}
      >
        {!hideViewToggle && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="Widok listy książek"
            size="small"
            sx={{
              p: 0.375,
              bgcolor: "grey.100",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
              gap: 0.25,
              "& .MuiToggleButtonGroup-grouped": {
                border: "none",
                borderRadius: "8px !important",
                mx: 0,
              },
              "& .MuiToggleButton-root": {
                textTransform: "none",
                px: { xs: 1.25, sm: 1.5 },
                py: 0.75,
                minWidth: { xs: 40, sm: "auto" },
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.8125rem",
                transition: "all 0.2s ease",
                "&.Mui-selected": {
                  bgcolor: "background.paper",
                  color: "primary.main",
                  boxShadow: "0 1px 3px rgba(26, 32, 44, 0.08)",
                  "&:hover": {
                    bgcolor: "background.paper",
                  },
                },
                "&:hover": {
                  bgcolor: "rgba(102, 126, 234, 0.06)",
                },
              },
            }}
          >
            <ToggleButton value="cards" aria-label="Widok siatki">
              <GridViewIcon sx={{ fontSize: 18, mr: { xs: 0, sm: 0.75 } }} />
              {!isMobile && "Siatka"}
            </ToggleButton>
            <ToggleButton value="table" aria-label="Widok tabeli">
              <ViewListIcon sx={{ fontSize: 18, mr: { xs: 0, sm: 0.75 } }} />
              {!isMobile && "Tabela"}
            </ToggleButton>
          </ToggleButtonGroup>
        )}

        {!hideAddButton && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddBook}
            sx={{
              flex: { xs: 1, sm: "none" },
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 2,
              px: { xs: 2, sm: 2.5 },
              py: 1,
              minHeight: 40,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.875rem",
              boxShadow: "0 2px 10px rgba(102, 126, 234, 0.28)",
              whiteSpace: "nowrap",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                boxShadow: "0 4px 16px rgba(102, 126, 234, 0.36)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {isMobile ? "Dodaj" : "Dodaj książkę"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
