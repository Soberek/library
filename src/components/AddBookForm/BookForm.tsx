import React from "react";
import { GENRES } from "../../constants/genres";
import { BOOK_STATUSES, BOOK_STATUS_LABELS } from "../../constants/bookStatus";
import type { Book, BookStatus, BookFormData } from "../../types/Book";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookFormSchema } from "../../schemas/bookSchema";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  MenuItem,
  Autocomplete,
  Divider,
  Rating,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// type FormValues = {
//   title: string;
//   author: string;
//   read: string;
//   genre: string;
//   readPages: number;
//   pages: number;
//   cover: string;
//   stars: number;
// };

type Props = {
  mode: "add" | "edit";
  bookToEdit?: Book | null;
  handleBookSubmit?: (data: BookFormData) => void;
  handleBookUpdate?: (bookId: string, newBook: Book) => void;
  handleBookModalOpen: (params: {
    mode: "add" | "edit";
    bookId: string | null;
  }) => void;
  handleBookModalClose: () => void;
  isFormVisible: boolean;
};

const genreOptions = Object.entries(GENRES)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([value, label]) => ({
    value,
    label,
  }));

const DEFAULT_VALUES = {
  title: "",
  author: "",
  read: "W trakcie" as BookStatus,
  genre: "",
  readPages: 0,
  overallPages: 1,
  cover: "",
  rating: 0,
};

const BookForm: React.FC<Props> = ({
  mode,
  bookToEdit,
  handleBookSubmit,
  handleBookUpdate,
  handleBookModalClose,
  isFormVisible,
}) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(bookFormSchema),
    defaultValues: mode === "edit" && bookToEdit ? bookToEdit : DEFAULT_VALUES,
  });

  const onSubmit = (data: any) => {
    if (mode === "add") {
      const result = handleBookSubmit?.(data);
      if (result) {
        handleBookModalClose();
      }
    } else if (mode === "edit") {
      const result = handleBookUpdate?.(bookToEdit?.id || "", data as Book);
      if (result) {
        handleBookModalClose();
      }
    }
    reset();
  };

  console.log("book form mode:", mode);

  return (
    <Dialog
      open={isFormVisible}
      onClose={handleBookModalClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {mode === "add"
          ? "Dodaj nową książkę"
          : `Edytujesz książkę: ${bookToEdit?.title}`}

        <IconButton
          onClick={() => handleBookModalClose()}
          aria-label="Zamknij formularz"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Proszę poprawić błędy w formularzu
            </Alert>
          )}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="Tytuł"
                variant="outlined"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
          <Controller
            name="author"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Autor"
                required
                variant="outlined"
                fullWidth
                error={!!errors.author}
                helperText={errors.author?.message}
              />
            )}
          />
          <Controller
            name="read"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                required
                label="Status"
                variant="outlined"
                fullWidth
                error={!!errors.read}
                helperText={errors.read?.message}
              >
                {BOOK_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {BOOK_STATUS_LABELS[status]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="genre"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={genreOptions}
                getOptionLabel={(option) => option.label}
                onChange={(_, value) => field.onChange(value?.value)}
                value={
                  genreOptions.find((option) => option.value === field.value) ||
                  null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Gatunek"
                    variant="outlined"
                    fullWidth
                    error={!!errors.genre}
                    helperText={errors.genre?.message}
                  />
                )}
              />
            )}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Controller
              name="readPages"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Przeczytane strony"
                  inputProps={{ min: 0, max: 5000 }}
                  variant="outlined"
                  fullWidth
                  error={!!errors.readPages}
                  helperText={errors.readPages?.message}
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                />
              )}
            />
            <Divider orientation="vertical" flexItem />
            <Controller
              name="overallPages"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Liczba stron"
                  inputProps={{ min: 1, max: 5000 }}
                  variant="outlined"
                  fullWidth
                  error={!!errors.overallPages}
                  helperText={errors.overallPages?.message}
                  onChange={(e) => field.onChange(e.target.value === '' ? 1 : Number(e.target.value))}
                />
              )}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Rating
                  {...field}
                  size="large"
                  name="star-rating"
                  max={10}
                  value={Number(field.value)}
                  onChange={(_, value) => field.onChange(value ?? 0)}
                />
              )}
            />
          </Box>
          <Controller
            name="cover"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Okładka (URL)"
                variant="outlined"
                fullWidth
                inputProps={{ "data-testid": "cover-input" }}
                error={!!errors.cover}
                helperText={errors.cover?.message}
              />
            )}
          />
          {mode === "edit" && (
            <Button
              type="submit"
              variant="outlined"
              color="secondary"
              sx={{
                mt: 2,
                fontWeight: "bold",
                background:
                  "linear-gradient(30deg, #00ce67ff 30%, #186600ff 90%)",
              }}
            >
              Edytuj książkę {mode}
            </Button>
          )}
          {mode === "add" && (
            <Button
              type="submit"
              variant="outlined"
              sx={{ mt: 2, fontWeight: "bold" }}
            >
              Dodaj książkę
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BookForm;
