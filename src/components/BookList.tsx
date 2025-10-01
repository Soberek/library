import React, { memo, useEffect, useState } from "react";
import type { Book, BookStatus } from "../types/Book";
import { BOOK_STATUS_LABELS } from "../constants/bookStatus";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  LinearProgress,
  Grid,
  Button,
  CircularProgress,
  Rating,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// editing existing book
// on textfield click set to isEditing, setIsEditingBookId to book.id
// on textfield blur set to isEditing to false

type Props = {
  books: Book[];
  loading: boolean;
  handleStatusChange: (bookId: string, currentStatus: BookStatus) => void;
  handleBookUpdate: (bookId: string, newBook: Book) => void;
  handleBookDelete: (bookId: string) => void;
  handleBookModalOpen: (params: {
    mode: "add" | "edit";
    bookId: string | null;
  }) => void;
  handleBookModalClose: (params: {
    bookId: string | null;
    mode: "add" | "edit";
  }) => void;
};

const statusColors: Record<BookStatus, "success" | "warning" | "error"> = {
  Przeczytana: "success",
  "W trakcie": "warning",
  Porzucona: "error",
};

const BookList: React.FC<Props> = memo(({
  books,
  loading,
  handleStatusChange,
  handleBookUpdate,
  handleBookDelete,
  handleBookModalOpen,
}) => {
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [favoriteBooks, setFavoriteBooks] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, bookId: string) => {
    setAnchorEl({ ...anchorEl, [bookId]: event.currentTarget });
  };

  const handleMenuClose = (bookId: string) => {
    setAnchorEl({ ...anchorEl, [bookId]: null });
  };

  const toggleFavorite = (bookId: string) => {
    setFavoriteBooks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  const handleShare = async (book: Book) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `Sprawdź tę książkę: ${book.title} by ${book.author}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${book.title} by ${book.author} - ${window.location.href}`);
    }
  };
  if (loading) {
    return (
      <Box
        display="flex"
        minHeight={400}
        alignItems="center"
        justifyContent="center"
        sx={{ py: 8 }}
      >
        <Fade in timeout={800}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <CircularProgress 
              color="primary" 
              size={60}
              thickness={4}
              sx={{
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Typography 
              color="text.secondary" 
              fontWeight={600}
              variant="h6"
              sx={{ opacity: 0.8 }}
            >
              Ładowanie książek...
            </Typography>
          </Box>
        </Fade>
      </Box>
    );
  }

  if (books.length === 0) {
    return (
      <Box
        display="flex"
        minHeight={400}
        alignItems="center"
        justifyContent="center"
        sx={{ py: 8 }}
      >
        <Fade in timeout={800}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.1,
              }}
            >
              <BookmarkIcon sx={{ fontSize: 60, color: "white" }} />
            </Box>
            <Typography 
              color="text.secondary" 
              fontWeight={600}
              variant="h5"
              textAlign="center"
            >
              Brak książek w bibliotece
            </Typography>
            <Typography 
              color="text.secondary" 
              variant="body1"
              textAlign="center"
              sx={{ maxWidth: 400 }}
            >
              Dodaj swoją pierwszą książkę, aby rozpocząć śledzenie swoich lektur
            </Typography>
          </Box>
        </Fade>
      </Box>
    );
  }

  const sortedBooks = [...books].sort((a, b) => {
    const dateA = new Date(a.createdAt ?? 0).getTime();
    const dateB = new Date(b.createdAt ?? 0).getTime();
    return dateB - dateA;
  });

  if (!mounted) {
    return null;
  }

  return (
    <Grid container spacing={2} sx={{ p: 1 }}>
      {sortedBooks.map((book, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} key={book.id}>
          <Zoom in={mounted} timeout={600 + index * 100}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                borderRadius: 3,
                flexDirection: "column",
                position: "relative",
                background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.06)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px) scale(1.01)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                  "& .book-cover": {
                    transform: "scale(1.02)",
                  },
                  "& .book-actions": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              {/* Book Cover */}
              <Box sx={{ position: "relative", p: 1.5 }}>
                {book.cover ? (
                  <CardMedia
                    component="img"
                    image={book.cover}
                    alt={`${book.title} cover`}
                    className="book-cover"
                    sx={{
                      height: 180,
                      width: "100%",
                      borderRadius: 2,
                      objectFit: "contain",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease",
                      bgcolor: "rgba(0,0,0,0.05)",
                    }}
                  />
                ) : (
                  <Box
                    className="book-cover"
                    sx={{
                      height: 180,
                      width: "100%",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      position: "relative",
                      transition: "transform 0.3s ease",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        zIndex: 1,
                      }}
                    >
                      <BookmarkIcon sx={{ fontSize: 40, color: "white", opacity: 0.8, mb: 0.5 }} />
                      <Typography
                        variant="caption"
                        color="white"
                        fontWeight={600}
                        textAlign="center"
                        sx={{ opacity: 0.9, fontSize: "0.75rem" }}
                      >
                        Brak okładki
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Action Buttons Overlay */}
                <Box
                  className="book-actions"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    display: "flex",
                    gap: 0.5,
                    opacity: 0,
                    transform: "translateY(-10px)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Tooltip title="Dodaj do ulubionych">
                    <IconButton
                      size="small"
                      onClick={() => toggleFavorite(book.id)}
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                        "&:hover": { bgcolor: "white" },
                      }}
                    >
                      {favoriteBooks.has(book.id) ? (
                        <BookmarkIcon sx={{ color: "#ff6b6b", fontSize: 20 }} />
                      ) : (
                        <BookmarkBorderIcon sx={{ color: "#666", fontSize: 20 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Udostępnij">
                    <IconButton
                      size="small"
                      onClick={() => handleShare(book)}
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                        "&:hover": { bgcolor: "white" },
                      }}
                    >
                      <ShareIcon sx={{ color: "#666", fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Status Badge */}
                <Chip
                  label={BOOK_STATUS_LABELS[book.read]}
                  color={statusColors[book.read]}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 24,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />
              </Box>

              {/* Book Content */}
              <CardContent sx={{ flex: 1, p: 2, pt: 1 }}>
                {/* Title and Author */}
                <Box mb={1.5}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                      lineClamp: 2,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      color: "text.primary",
                      fontSize: "1rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {book.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontWeight: 500, fontSize: "0.85rem" }}
                  >
                    {book.author}
                  </Typography>
                </Box>

                {/* Progress Section */}
                <Box mb={1.5}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: "0.75rem" }}>
                      Postęp
                    </Typography>
                    <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ fontSize: "0.75rem" }}>
                      {book.readPages} / {book.overallPages}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(
                      ((book.readPages ?? 0) / (book.overallPages ?? 1)) * 100,
                      100,
                    )}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      mb: 0.5,
                      bgcolor: "rgba(0,0,0,0.1)",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: "0.7rem" }}>
                    {Math.round(
                      ((book.readPages ?? 0) / (book.overallPages ?? 1)) * 100,
                    )}
                    % ukończone
                  </Typography>
                </Box>

                {/* Rating Section */}
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: "0.75rem" }}>
                      Ocena
                    </Typography>
                    <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ fontSize: "0.75rem" }}>
                      {book.rating}/10
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="center">
                    <Rating
                      name={`book-rating-${book.id}`}
                      value={book.rating}
                      max={10}
                      precision={0.5}
                      size="small"
                      sx={{ "& .MuiRating-icon": { fontSize: "1rem" } }}
                      onChange={(_, newValue) =>
                        handleBookUpdate(book.id, {
                          ...book,
                          rating: newValue ?? book.rating,
                        })
                      }
                      icon={<StarIcon sx={{ color: "#FFD700" }} />}
                      emptyIcon={<StarBorderIcon sx={{ color: "#E0E0E0" }} />}
                    />
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    mt: "auto",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon sx={{ fontSize: "1rem" }} />}
                    onClick={() => handleBookDelete(book.id)}
                    aria-label={`Usuń książkę ${book.title}`}
                    sx={{
                      flex: 1,
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      py: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    Usuń
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<EditIcon sx={{ fontSize: "1rem" }} />}
                    onClick={() =>
                      handleBookModalOpen({ mode: "edit", bookId: book.id })
                    }
                    aria-label={`Edytuj książkę ${book.title}`}
                    sx={{
                      flex: 1,
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      py: 0.5,
                      fontSize: "0.75rem",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Edytuj
                  </Button>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, book.id)}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      minWidth: 32,
                      height: 32,
                    }}
                  >
                    <MoreVertIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </Box>
              </CardContent>

              {/* Context Menu */}
              <Menu
                anchorEl={anchorEl[book.id]}
                open={Boolean(anchorEl[book.id])}
                onClose={() => handleMenuClose(book.id)}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    minWidth: 160,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose(book.id);
                    handleStatusChange(book.id, book.read);
                  }}
                >
                  <ListItemIcon>
                    <BookmarkIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Zmień status</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose(book.id);
                    handleShare(book);
                  }}
                >
                  <ListItemIcon>
                    <ShareIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Udostępnij</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleMenuClose(book.id);
                    handleBookDelete(book.id);
                  }}
                  sx={{ color: "error.main" }}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>Usuń książkę</ListItemText>
                </MenuItem>
              </Menu>
            </Card>
          </Zoom>
        </Grid>
      ))}
    </Grid>
  );
});

BookList.displayName = "BookList";

export default BookList;
