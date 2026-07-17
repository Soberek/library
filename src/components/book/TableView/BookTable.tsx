import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  IconButton,
  Tooltip,
  Typography,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import type { Book, BookStatus } from "../../../types/Book";
import { GOLD } from "../../../constants/bookUi";
import { useFilterStore } from "../../../stores";
import { formatBookCount } from "../../../utils/textHelpers";
import StatusMenuButton from "../StatusMenuButton";

interface BookTableProps {
  books: Book[];
  handleStatusChange: (bookId: string, newStatus: BookStatus) => void;
  handleRatingChange: (bookId: string, newRating: number) => void;
  handleToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  handleEdit: (bookId: string) => void;
  handleDelete: (bookId: string) => void;
}

type SortField = NonNullable<
  ReturnType<typeof useFilterStore.getState>["filters"]["sortBy"]
>;

export default function BookTable({
  books,
  handleStatusChange,
  handleRatingChange,
  handleToggleFavorite,
  handleEdit,
  handleDelete,
}: BookTableProps) {
  const sortBy = useFilterStore((state) => state.filters.sortBy);
  const sortOrder = useFilterStore((state) => state.filters.sortOrder);
  const showOnlyFavorites = useFilterStore(
    (state) => state.filters.showOnlyFavorites,
  );
  const setFilter = useFilterStore((state) => state.setFilter);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    const newOrder =
      sortBy === field && sortOrder === "asc" ? "desc" : "asc";

    if (sortBy === field) {
      setFilter("sortOrder", newOrder);
    } else {
      setFilter("sortBy", field);
      setFilter("sortOrder", "asc");
    }
  };

  const deleteBook = books.find((b) => b.id === deleteId);

  const SortableHeader = ({
    field,
    label,
    align = "left",
    width,
  }: {
    field: SortField;
    label: string;
    align?: "left" | "center" | "right";
    width?: number | string;
  }) => {
    const active = sortBy === field;
    const ariaSort = active
      ? sortOrder === "asc"
        ? "ascending"
        : "descending"
      : "none";

    return (
      <TableCell
        align={align}
        role="columnheader"
        aria-sort={ariaSort}
        tabIndex={0}
        onClick={() => handleSort(field)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSort(field);
          }
        }}
        sx={{
          width,
          py: 1.25,
          px: 2,
          cursor: "pointer",
          userSelect: "none",
          borderBottom: "1px solid",
          borderColor: "grey.200",
          bgcolor: "grey.50",
          whiteSpace: "nowrap",
          outline: "none",
          "&:hover": { bgcolor: "rgba(102, 126, 234, 0.06)" },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: -2,
          },
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            color: active ? "primary.main" : "text.secondary",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </Typography>
          {active &&
            (sortOrder === "asc" ? (
              <ArrowUpwardIcon sx={{ fontSize: 14 }} />
            ) : (
              <ArrowDownwardIcon sx={{ fontSize: 14 }} />
            ))}
        </Box>
      </TableCell>
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          px: { xs: 1.5, sm: 2 },
          py: 1.25,
          borderBottom: "1px solid",
          borderColor: "grey.100",
          bgcolor: "grey.50",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "text.secondary",
          }}
        >
          {formatBookCount(books.length)}
        </Typography>
      </Box>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <SortableHeader field="title" label="Tytuł" />
              <SortableHeader field="author" label="Autor" width={160} />
              <SortableHeader field="status" label="Status" width={150} />
              <SortableHeader field="rating" label="Ocena" width={160} />
              <SortableHeader field="pages" label="Postęp" width={150} />
              <TableCell
                align="right"
                sx={{
                  py: 1.25,
                  px: 2,
                  borderBottom: "1px solid",
                  borderColor: "grey.200",
                  bgcolor: "grey.50",
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Akcje
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 6, textAlign: "center" }}>
                  <Typography color="text.secondary" fontWeight={500}>
                    {showOnlyFavorites
                      ? "Brak ulubionych książek"
                      : "Brak książek"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => {
                const isFavorite = Boolean(book.isFavorite);
                const progress =
                  book.overallPages > 0
                    ? Math.min(
                        ((book.readPages || 0) / book.overallPages) * 100,
                        100,
                      )
                    : 0;

                return (
                  <TableRow
                    key={book.id}
                    hover
                    sx={{
                      bgcolor: isFavorite ? "rgba(248, 241, 223, 0.45)" : "#fff",
                      "&:hover": {
                        bgcolor: isFavorite
                          ? "rgba(248, 241, 223, 0.7)"
                          : "rgba(102, 126, 234, 0.04)",
                      },
                      "& td": {
                        borderBottom: "1px solid",
                        borderColor: "grey.100",
                        py: 1.25,
                        px: 2,
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          minWidth: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 48,
                            borderRadius: 1,
                            overflow: "hidden",
                            flexShrink: 0,
                            bgcolor: isFavorite ? GOLD.soft : "grey.100",
                            border: "1px solid",
                            borderColor: isFavorite
                              ? "rgba(201, 162, 39, 0.4)"
                              : "grey.200",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {book.cover ? (
                            <Box
                              component="img"
                              src={book.cover}
                              alt=""
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <MenuBookOutlinedIcon
                              sx={{
                                fontSize: 18,
                                color: isFavorite ? GOLD.rich : "grey.400",
                              }}
                            />
                          )}
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.75,
                              minWidth: 0,
                            }}
                          >
                            <Tooltip title={book.title}>
                              <Typography
                                onClick={() => handleEdit(book.id)}
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "0.875rem",
                                  color: "text.primary",
                                  cursor: "pointer",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: { xs: 140, sm: 220, md: 280 },
                                  "&:hover": { color: "primary.main" },
                                }}
                              >
                                {book.title}
                              </Typography>
                            </Tooltip>
                            {isFavorite && (
                              <Box
                                sx={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                  background: `conic-gradient(from 210deg, ${GOLD.deep}, ${GOLD.mid}, #f5e6a8, ${GOLD.rich}, ${GOLD.deep})`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    bgcolor: "#fffaf0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <FavoriteIcon
                                    sx={{ fontSize: 8, color: GOLD.rich }}
                                  />
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "0.8125rem",
                          color: "text.secondary",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 150,
                        }}
                      >
                        {book.author}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <StatusMenuButton
                        status={book.read}
                        onSelect={(next) => handleStatusChange(book.id, next)}
                        variant="pill"
                      />
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                        }}
                      >
                        <Rating
                          value={book.rating / 2}
                          onChange={(_, newValue) =>
                            handleRatingChange(
                              book.id,
                              (newValue || 0) * 2,
                            )
                          }
                          precision={0.5}
                          size="small"
                          sx={{
                            "& .MuiRating-iconFilled": {
                              color: isFavorite ? GOLD.rich : "#f59e0b",
                            },
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "text.secondary",
                            minWidth: 24,
                          }}
                        >
                          {book.rating.toFixed(1)}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ minWidth: 110 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.4,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              color: "text.secondary",
                            }}
                          >
                            {book.readPages || 0}/{book.overallPages}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              color: isFavorite ? GOLD.deep : "primary.main",
                            }}
                          >
                            {Math.round(progress)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            height: 4,
                            borderRadius: 999,
                            bgcolor: isFavorite
                              ? "rgba(201,162,39,0.15)"
                              : "grey.200",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 999,
                              background: isFavorite
                                ? `linear-gradient(90deg, ${GOLD.rich}, ${GOLD.mid})`
                                : "linear-gradient(90deg, #667eea, #764ba2)",
                            },
                          }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "inline-flex",
                          gap: 0.25,
                        }}
                      >
                        <Tooltip
                          title={
                            isFavorite
                              ? "Usuń z ulubionych"
                              : "Dodaj do ulubionych"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleToggleFavorite(book.id, isFavorite)
                            }
                            sx={{
                              color: isFavorite ? GOLD.rich : "grey.400",
                              "&:hover": {
                                color: isFavorite ? GOLD.deep : "error.main",
                                bgcolor: isFavorite
                                  ? "rgba(201,162,39,0.1)"
                                  : "rgba(239,68,68,0.06)",
                              },
                            }}
                          >
                            {isFavorite ? (
                              <FavoriteIcon sx={{ fontSize: 18 }} />
                            ) : (
                              <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edytuj">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(book.id)}
                            sx={{
                              color: "grey.400",
                              "&:hover": {
                                color: "primary.main",
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
                            onClick={() => setDeleteId(book.id)}
                            sx={{
                              color: "grey.400",
                              "&:hover": {
                                color: "error.main",
                                bgcolor: "rgba(239,68,68,0.08)",
                              },
                            }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        aria-labelledby="delete-book-table-title"
      >
        <DialogTitle id="delete-book-table-title">
          Potwierdź usunięcie
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć
            {deleteBook ? ` „${deleteBook.title}”` : " tę książkę"}? Tej
            operacji nie można cofnąć.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Anuluj</Button>
          <Button
            color="error"
            autoFocus
            onClick={() => {
              if (deleteId) handleDelete(deleteId);
              setDeleteId(null);
            }}
          >
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
