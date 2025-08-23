import type { Book } from "../types/Book";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

type Props = {
  books: Book[];
  loading: boolean;
  handleStatusChange: (bookId: string, newStatus: string) => void;
  handleRatingChange: (bookId: string, newRating: number) => void;
  handleBookDelete: (bookId: string) => void;
};

const statusColors: Record<string, "success" | "warning" | "error"> = {
  Przeczytana: "success",
  "W trakcie": "warning",
  Porzucona: "error",
};

const BookList: React.FC<Props> = ({
  books,
  loading,
  handleStatusChange,
  handleRatingChange,
  handleBookDelete,
}) => {
  if (loading) {
    return (
      <Box
        display="flex"
        minHeight={400}
        alignItems="center"
        justifyContent="center"
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress color="primary" size={48} />
          <Typography color="text.secondary" fontWeight={500}>
            Ładowanie książek...
          </Typography>
        </Box>
      </Box>
    );
  }

  const sortedBooks = [...books].sort((a, b) => {
    const dateA = new Date(a.createdAt ?? 0).getTime();
    const dateB = new Date(b.createdAt ?? 0).getTime();
    return dateB - dateA;
  });

  return (
    <Grid container spacing={3} padding={2}>
      {sortedBooks.map((book) => (
        <Grid size={{ xs: 12, md: 6, lg: 3, xl: 2 }} key={book.id}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              borderRadius: 6,
              flexDirection: "column",
              position: "relative",
              boxShadow: 6,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 12,
              },
            }}
          >
            <CardMedia
              component="img"
              image={book.cover}
              alt={`${book.title} cover`}
              sx={{
                height: 225,
                width: 150,
                margin: "16px auto 0 auto",
                borderRadius: 2,
                objectFit: "cover",
                boxShadow: 3,
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />
            <CardContent sx={{ flex: 1 }}>
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
                }}
              >
                {book.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                <span style={{ color: "#888" }}>Autor:</span> {book.author}
              </Typography>
              <Box mb={1}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="span"
                >
                  Status:
                </Typography>
                <Chip
                  label={book.read}
                  color={statusColors[book.read] || "default"}
                  size="small"
                  sx={{ ml: 1, cursor: "pointer" }}
                  onClick={() => handleStatusChange(book.id, book.read)}
                />
              </Box>
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Postęp
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
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
                    height: 8,
                    borderRadius: 5,
                    mb: 0.5,
                  }}
                  color="primary"
                />
                <Typography variant="caption" color="text.secondary">
                  {Math.round(
                    ((book.readPages ?? 0) / (book.overallPages ?? 1)) * 100,
                  )}
                  % ukończone
                </Typography>
              </Box>
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Ocena
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {book.rating}/10
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="center">
                  <Rating
                    name={`book-rating-${book.id}`}
                    value={book.rating}
                    max={10}
                    precision={1}
                    onChange={(_, newValue) =>
                      handleRatingChange(book.id, newValue ?? book.rating)
                    }
                    icon={<StarIcon sx={{ color: "#FFD600" }} />}
                    emptyIcon={<StarBorderIcon sx={{ color: "#E0E0E0" }} />}
                  />
                </Box>
              </Box>
              <Button
                variant="contained"
                color="error"
                fullWidth
                startIcon={<DeleteIcon />}
                onClick={() => handleBookDelete(book.id)}
                sx={{
                  fontWeight: 600,
                  mt: 1,
                  textTransform: "none",
                  boxShadow: 2,
                  "&:hover": { boxShadow: 4 },
                }}
              >
                Usuń książkę
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default BookList;
