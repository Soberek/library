import React from "react";
import { GENRES } from "../../constants/genres";
import type { Book } from "../../types/Book";
import { useForm, Controller } from "react-hook-form";
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
  handleBookSubmit: (data: Book) => void;
  handleFormVisibility: () => void;
  isFormVisible: boolean;
};

const genreOptions = Object.entries(GENRES)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([value, label]) => ({
    value,
    label,
  }));

const BookForm: React.FC<Props> = ({
  handleBookSubmit,
  handleFormVisibility,
  isFormVisible,
}) => {
  const { control, handleSubmit, reset } = useForm<Book>({
    defaultValues: {
      title: "",
      author: "",
      read: "",
      genre: "",
      readPages: 0,
      overallPages: 1,
      cover: "",
      rating: 0,
    },
  });

  const onSubmit = (data: Book) => {
    console.log(data);
    handleBookSubmit(data);
    reset();
  };

  return (
    <Dialog
      open={isFormVisible}
      onClose={handleFormVisibility}
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
        Dodaj nową książkę
        <IconButton
          onClick={handleFormVisibility}
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
              >
                <MenuItem value="" disabled>
                  Wybierz status
                </MenuItem>
                <MenuItem value="W trakcie">W trakcie</MenuItem>
                <MenuItem value="Przeczytana">Przeczytana</MenuItem>
                <MenuItem value="Porzucona">Porzucona</MenuItem>
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
                  value={field.value}
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
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, fontWeight: "bold" }}
            fullWidth
          >
            Dodaj książkę
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BookForm;
