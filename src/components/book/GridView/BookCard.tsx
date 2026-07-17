import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Rating,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import type { Book, BookStatus } from "../../../types/Book";
import { BOOK_STATUS_LABELS } from "../../../constants/bookStatus";

interface BookCardProps {
  book: Book;
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onShare?: (book: Book) => void;
  onToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  onRatingChange?: (bookId: string, newRating: number) => void;
}

const STATUS_STYLE: Record<
  BookStatus,
  { color: string; bg: string; border: string; Icon: React.ElementType; short: string }
> = {
  "Chcę przeczytać": {
    color: "#1d4ed8",
    bg: "rgba(59, 130, 246, 0.92)",
    border: "rgba(255,255,255,0.35)",
    Icon: BookmarkAddOutlinedIcon,
    short: "Do przeczytania",
  },
  "W trakcie": {
    color: "#b45309",
    bg: "rgba(245, 158, 11, 0.95)",
    border: "rgba(255,255,255,0.35)",
    Icon: AutoStoriesOutlinedIcon,
    short: "W trakcie",
  },
  Przeczytana: {
    color: "#15803d",
    bg: "rgba(34, 197, 94, 0.92)",
    border: "rgba(255,255,255,0.35)",
    Icon: CheckCircleOutlineIcon,
    short: "Przeczytana",
  },
  Porzucona: {
    color: "#b91c1c",
    bg: "rgba(239, 68, 68, 0.92)",
    border: "rgba(255,255,255,0.35)",
    Icon: HighlightOffOutlinedIcon,
    short: "Porzucona",
  },
};

const STATUS_ACCENT: Record<BookStatus, string> = {
  "Chcę przeczytać": "#3b82f6",
  "W trakcie": "#f59e0b",
  Przeczytana: "#22c55e",
  Porzucona: "#ef4444",
};

const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleFavorite,
  onRatingChange,
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const progress = Math.min(
    ((book.readPages ?? 0) / (book.overallPages || 1)) * 100,
    100,
  );
  const accent = STATUS_ACCENT[book.read] ?? "#667eea";
  const status = STATUS_STYLE[book.read];
  const StatusIcon = status.Icon;
  const isFavorite = Boolean(book.isFavorite);

  const nextStatusLabel = (() => {
    switch (book.read) {
      case "Przeczytana":
      case "Porzucona":
        return BOOK_STATUS_LABELS["Chcę przeczytać"];
      case "W trakcie":
        return BOOK_STATUS_LABELS.Przeczytana;
      case "Chcę przeczytać":
        return BOOK_STATUS_LABELS["W trakcie"];
      default:
        return BOOK_STATUS_LABELS["Chcę przeczytać"];
    }
  })();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2.5,
        position: "relative",
        border: "1px solid",
        borderColor: isFavorite
          ? "rgba(184, 149, 106, 0.55)"
          : "grey.200",
        bgcolor: isFavorite ? "#fffdf8" : "background.paper",
        backgroundImage: isFavorite
          ? "linear-gradient(165deg, #fffefb 0%, #fffdf8 45%, #ffffff 100%)"
          : "none",
        overflow: "hidden",
        boxShadow: isFavorite
          ? "0 1px 2px rgba(139, 105, 60, 0.06), 0 8px 24px rgba(139, 105, 60, 0.08)"
          : "none",
        transition:
          "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
        ...(isFavorite && {
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 16,
            right: 16,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(184, 149, 106, 0.7), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          },
        }),
        "&:hover": {
          borderColor: isFavorite
            ? "rgba(184, 149, 106, 0.85)"
            : "grey.300",
          boxShadow: isFavorite
            ? "0 2px 4px rgba(139, 105, 60, 0.08), 0 12px 28px rgba(139, 105, 60, 0.12)"
            : "0 4px 16px rgba(26, 32, 44, 0.06)",
          "& .card-actions": { opacity: 1 },
        },
      }}
    >
      {/* Cover */}
      <Box
        sx={{
          position: "relative",
          aspectRatio: "3 / 4",
          maxHeight: 220,
          bgcolor: "grey.100",
          overflow: "hidden",
        }}
      >
        {book.cover ? (
          <Box
            component="img"
            src={book.cover}
            alt={book.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              background: `linear-gradient(160deg, ${accent}22 0%, ${accent}55 100%)`,
              color: accent,
            }}
          >
            <MenuBookOutlinedIcon sx={{ fontSize: 40, opacity: 0.85 }} />
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                opacity: 0.8,
              }}
            >
              Brak okładki
            </Typography>
          </Box>
        )}

        {/* Status + favorite overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.35) 0%, transparent 42%)",
            pointerEvents: "none",
            "& > *": { pointerEvents: "auto" },
          }}
        >
          <Tooltip title={`Zmień status → ${nextStatusLabel}`} arrow>
            <Box
              component="button"
              type="button"
              onClick={() => onStatusChange(book.id, book.read)}
              aria-label={`Status: ${book.read}. Kliknij, aby zmienić.`}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                maxWidth: "70%",
                px: 0.875,
                py: 0.4,
                border: "1px solid",
                borderColor: status.border,
                borderRadius: 1.25,
                bgcolor: status.bg,
                color: "#fff",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.01em",
                lineHeight: 1.2,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.22)",
                backdropFilter: "blur(8px)",
                transition: "transform 0.15s ease, filter 0.15s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  filter: "brightness(1.05)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              <StatusIcon sx={{ fontSize: 13, flexShrink: 0 }} />
              <Box
                component="span"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {status.short}
              </Box>
            </Box>
          </Tooltip>

          <Tooltip
            title={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          >
            <IconButton
              size="small"
              onClick={() => onToggleFavorite(book.id, isFavorite)}
              sx={{
                width: 30,
                height: 30,
                bgcolor: isFavorite
                  ? "rgba(255, 252, 245, 0.95)"
                  : "rgba(255,255,255,0.92)",
                color: isFavorite ? "#a67c52" : "text.secondary",
                border: "1px solid",
                borderColor: isFavorite
                  ? "rgba(184, 149, 106, 0.45)"
                  : "rgba(255,255,255,0.5)",
                boxShadow: isFavorite
                  ? "0 1px 6px rgba(139, 105, 60, 0.18)"
                  : "0 1px 4px rgba(0,0,0,0.12)",
                "&:hover": {
                  bgcolor: isFavorite
                    ? "rgba(255, 250, 240, 1)"
                    : "rgba(255,255,255,1)",
                  borderColor: isFavorite
                    ? "rgba(184, 149, 106, 0.7)"
                    : "rgba(255,255,255,0.8)",
                  color: isFavorite ? "#8b6914" : "text.primary",
                },
              }}
            >
              {isFavorite ? (
                <StarIcon sx={{ fontSize: 15 }} />
              ) : (
                <BookmarkBorderIcon sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Progress strip on cover bottom */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            px: 1,
            py: 0.75,
            background:
              "linear-gradient(0deg, rgba(15,23,42,0.55) 0%, transparent 100%)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 0.4,
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: "0.65rem",
                fontWeight: 600,
                textShadow: "0 1px 2px rgba(0,0,0,0.35)",
              }}
            >
              {book.readPages}/{book.overallPages}
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontSize: "0.65rem",
                fontWeight: 700,
                textShadow: "0 1px 2px rgba(0,0,0,0.35)",
              }}
            >
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 3,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.25)",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#fff",
                borderRadius: 2,
              },
            }}
          />
        </Box>
      </Box>

      {/* Body */}
      <Box
        sx={{
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          flex: 1,
        }}
      >
        <Box sx={{ minHeight: 0 }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: isFavorite ? 750 : 700,
              fontSize: "0.9375rem",
              lineHeight: 1.25,
              letterSpacing: isFavorite ? "-0.01em" : "-0.015em",
              color: isFavorite ? "#1c1917" : "text.primary",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 0.35,
            }}
          >
            {book.title}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: isFavorite ? "#78716c" : "text.secondary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {book.author}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mt: "auto",
            pt: 0.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Rating
              name={`rating-${book.id}`}
              value={book.rating / 2}
              precision={0.5}
              max={5}
              size="small"
              onChange={(_, newValue) => {
                if (newValue !== null && onRatingChange) {
                  onRatingChange(book.id, newValue * 2);
                }
              }}
              icon={<StarIcon sx={{ fontSize: 16 }} />}
              emptyIcon={
                <StarBorderIcon sx={{ fontSize: 16, color: "grey.300" }} />
              }
              sx={{
                "& .MuiRating-iconFilled": { color: "#f59e0b" },
                "& .MuiRating-iconHover": { color: "#d97706" },
              }}
            />
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "text.secondary",
                minWidth: 28,
              }}
            >
              {book.rating.toFixed(1)}
            </Typography>
          </Box>

          <Box
            className="card-actions"
            sx={{
              display: "flex",
              gap: 0.25,
              opacity: { xs: 1, md: 0.55 },
              transition: "opacity 0.2s ease",
            }}
          >
            <Tooltip title="Edytuj">
              <IconButton
                size="small"
                onClick={() => onEdit(book.id)}
                aria-label="Edytuj"
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: "rgba(102, 126, 234, 0.08)",
                  },
                }}
              >
                <EditOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Usuń">
              <IconButton
                size="small"
                onClick={() => setOpenDeleteDialog(true)}
                aria-label="Usuń"
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    color: "error.main",
                    bgcolor: "rgba(239, 68, 68, 0.08)",
                  },
                }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-book-title"
      >
        <DialogTitle id="delete-book-title">Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć „{book.title}”? Tej operacji nie można
            cofnąć.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Anuluj</Button>
          <Button
            color="error"
            autoFocus
            onClick={() => {
              onDelete(book.id);
              setOpenDeleteDialog(false);
            }}
          >
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookCard;
