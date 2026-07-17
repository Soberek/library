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
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { Book, BookStatus } from "../../../types/Book";
import { GOLD, STATUS_ACCENT } from "../../../constants/bookUi";
import StatusMenuButton from "../StatusMenuButton";

interface BookCardProps {
  book: Book;
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  onRatingChange?: (bookId: string, newRating: number) => void;
}

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
  const isFavorite = Boolean(book.isFavorite);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        bgcolor: "#fff",
        border: "1px solid",
        borderColor: isFavorite ? "rgba(201, 162, 39, 0.28)" : "rgba(15,23,42,0.08)",
        boxShadow: isFavorite
          ? `0 8px 28px ${GOLD.glow}, 0 2px 8px rgba(15,23,42,0.04)`
          : "0 2px 10px rgba(15,23,42,0.04)",
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: isFavorite
            ? `0 14px 36px ${GOLD.glow}, 0 6px 16px rgba(15,23,42,0.06)`
            : "0 10px 28px rgba(15,23,42,0.08)",
          "& .card-actions": { opacity: 1 },
        },
      }}
    >
      <Box
        onClick={() => onEdit(book.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onEdit(book.id);
          }
        }}
        aria-label={`Edytuj książkę ${book.title}`}
        sx={{
          position: "relative",
          height: 240,
          flexShrink: 0,
          overflow: "hidden",
          bgcolor: isFavorite ? GOLD.soft : "#f1f5f9",
          cursor: "pointer",
          ...(isFavorite && {
            boxShadow: `inset 0 0 0 2px ${GOLD.mid}, inset 0 0 0 5px rgba(248,241,223,0.95)`,
          }),
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
              objectFit: "contain",
              objectPosition: "center center",
              display: "block",
            }}
          />
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isFavorite
                ? `linear-gradient(145deg, ${GOLD.soft}, #efe0b0)`
                : `linear-gradient(145deg, ${accent}22, ${accent}44)`,
              color: isFavorite ? GOLD.deep : accent,
            }}
          >
            <MenuBookOutlinedIcon sx={{ fontSize: 48 }} />
          </Box>
        )}

        <Box
          sx={{ position: "absolute", top: 10, left: 10, zIndex: 3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <StatusMenuButton
            status={book.read}
            onSelect={(next) => onStatusChange(book.id, next)}
            variant="solid"
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            gap: 0.75,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {isFavorite && (
            <Box
              aria-hidden
              sx={{
                position: "relative",
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: `conic-gradient(from 210deg, ${GOLD.deep}, ${GOLD.mid}, #f5e6a8, ${GOLD.mid}, ${GOLD.deep}, ${GOLD.rich}, ${GOLD.deep})`,
                  boxShadow: `0 2px 10px ${GOLD.glow}`,
                }}
              />
              <Box
                sx={{
                  position: "relative",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  bgcolor: "#fffaf0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 0 1px rgba(201,162,39,0.3) inset",
                }}
              >
                <StarIcon sx={{ fontSize: 13, color: GOLD.rich }} />
              </Box>
            </Box>
          )}

          <Tooltip
            title={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          >
            <IconButton
              size="small"
              onClick={() => onToggleFavorite(book.id, isFavorite)}
              sx={{
                width: 32,
                height: 32,
                bgcolor: isFavorite ? GOLD.rich : "rgba(255,255,255,0.95)",
                color: isFavorite ? "#fff" : "#94a3b8",
                border: "1px solid",
                borderColor: isFavorite ? GOLD.deep : "rgba(15,23,42,0.08)",
                boxShadow: isFavorite
                  ? `0 4px 12px ${GOLD.glow}`
                  : "0 2px 6px rgba(15,23,42,0.08)",
                "&:hover": {
                  bgcolor: isFavorite ? GOLD.deep : "#fff",
                  color: isFavorite ? "#fff" : "#ef4444",
                },
              }}
            >
              {isFavorite ? (
                <FavoriteIcon sx={{ fontSize: 15 }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          px: 2,
          pb: 2,
          pt: 0.5,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          flex: 1,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          {isFavorite && (
            <Typography
              sx={{
                mb: 0.5,
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                background: `linear-gradient(90deg, ${GOLD.deep}, ${GOLD.rich}, ${GOLD.deep})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Ulubiona
            </Typography>
          )}
          <Typography
            component="h2"
            onClick={() => onEdit(book.id)}
            sx={{
              fontWeight: 800,
              fontSize: "1rem",
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              color: "#0f172a",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 0.35,
              cursor: "pointer",
              "&:hover": { color: "primary.main" },
            }}
          >
            {book.title}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 500,
              color: "#64748b",
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
            px: 1.25,
            py: 1,
            borderRadius: 2,
            bgcolor: isFavorite ? "rgba(248, 241, 223, 0.7)" : "#f8fafc",
            border: "1px solid",
            borderColor: isFavorite
              ? "rgba(201, 162, 39, 0.2)"
              : "rgba(15,23,42,0.05)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.6,
            }}
          >
            <Typography
              sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b" }}
            >
              {book.readPages} / {book.overallPages}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 800,
                color: isFavorite ? GOLD.deep : "#667eea",
              }}
            >
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 5,
              borderRadius: 999,
              bgcolor: isFavorite ? "rgba(201,162,39,0.15)" : "#e2e8f0",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background: isFavorite
                  ? `linear-gradient(90deg, ${GOLD.rich}, ${GOLD.mid})`
                  : "linear-gradient(90deg, #667eea, #764ba2)",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: "auto",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
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
              icon={<StarIcon sx={{ fontSize: 17 }} />}
              emptyIcon={
                <StarBorderIcon sx={{ fontSize: 17, color: "#cbd5e1" }} />
              }
              sx={{
                "& .MuiRating-iconFilled": {
                  color: isFavorite ? GOLD.rich : "#f59e0b",
                },
                "& .MuiRating-iconHover": {
                  color: isFavorite ? GOLD.deep : "#d97706",
                },
              }}
            />
            <Typography
              sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}
            >
              {book.rating.toFixed(1)}
            </Typography>
          </Box>

          <Box
            className="card-actions"
            sx={{
              display: "flex",
              gap: 0.25,
              opacity: { xs: 1, md: 0.45 },
              transition: "opacity 0.2s ease",
            }}
          >
            <Tooltip title="Edytuj">
              <IconButton
                size="small"
                onClick={() => onEdit(book.id)}
                aria-label="Edytuj"
                sx={{
                  color: "#94a3b8",
                  "&:hover": {
                    color: "#667eea",
                    bgcolor: "rgba(102,126,234,0.08)",
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
                  color: "#94a3b8",
                  "&:hover": {
                    color: "#ef4444",
                    bgcolor: "rgba(239,68,68,0.08)",
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
