import React, { useEffect, useState } from 'react';
import { GENRES } from '../../../constants/genres';
import { BOOK_STATUSES, BOOK_STATUS_LABELS } from '../../../constants/bookStatus';
import type { Book, BookStatus, BookFormData } from '../../../types/Book';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookFormSchema } from '../../../schemas/bookSchema';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Autocomplete,
  Divider,
  Rating,
  Alert,
  Typography,
} from '@mui/material';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

type Props = {
  initialData?: Book;
  onSubmit: (data: Book) => Promise<void>;
  onDirtyChange?: (dirty: boolean) => void;
};

const genreOptions = Object.entries(GENRES)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([value, label]) => ({
    value,
    label,
  }));

const DEFAULT_VALUES = {
  title: '',
  author: '',
  read: 'W trakcie' as BookStatus,
  genre: '',
  readPages: 0,
  overallPages: 1,
  cover: '',
  rating: 0,
};

const BookForm: React.FC<Props> = ({
  initialData,
  onSubmit: handleFormSubmit,
  onDirtyChange,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(bookFormSchema),
    defaultValues: initialData ? initialData : DEFAULT_VALUES,
  });

  const coverUrl = useWatch({ control, name: 'cover' }) || '';
  const overallPages = useWatch({ control, name: 'overallPages' }) || 1;
  const readPages = useWatch({ control, name: 'readPages' }) || 0;
  const [coverBroken, setCoverBroken] = useState(false);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    setCoverBroken(false);
  }, [coverUrl]);

  useEffect(() => {
    if (Number(readPages) > Number(overallPages)) {
      setValue('readPages', Number(overallPages), { shouldValidate: true, shouldDirty: true });
    }
  }, [overallPages, readPages, setValue]);

  const onSubmit = async (data: BookFormData) => {
    await handleFormSubmit(data as Book);
  };

  const showCoverPreview = Boolean(coverUrl && /^https?:\/\//i.test(coverUrl));

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pb: { xs: 10, sm: 0 },
      }}
    >
      {Object.keys(errors).length > 0 && (
        <Alert severity="error">
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
            {BOOK_STATUSES.map((status: BookStatus) => (
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
            getOptionLabel={(option: { value: string; label: string }) => option.label}
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
      <Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, mb: 0.75, color: 'text.secondary' }}
        >
          Ocena
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <Rating
                name="star-rating"
                max={5}
                precision={0.5}
                size="large"
                value={Number(field.value) / 2}
                onChange={(_, value) => field.onChange((value ?? 0) * 2)}
              />
            )}
          />
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'text.secondary', minWidth: 40 }}>
                {Number(field.value).toFixed(1)}/10
              </Typography>
            )}
          />
        </Box>
        {errors.rating && (
          <Typography variant="caption" color="error">
            {errors.rating.message}
          </Typography>
        )}
      </Box>
      <Controller
        name="cover"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="URL okładki"
            variant="outlined"
            fullWidth
            placeholder="https://..."
            inputProps={{ 'data-testid': 'cover-input' }}
            error={!!errors.cover}
            helperText={errors.cover?.message}
          />
        )}
      />
      {showCoverPreview && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200',
            bgcolor: 'grey.50',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 80,
              borderRadius: 1,
              overflow: 'hidden',
              bgcolor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {coverBroken ? (
              <MenuBookOutlinedIcon sx={{ color: 'grey.400' }} />
            ) : (
              <Box
                component="img"
                src={coverUrl}
                alt="Podgląd okładki"
                onError={() => setCoverBroken(true)}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {coverBroken
              ? 'Nie udało się wczytać obrazu — sprawdź URL'
              : 'Podgląd okładki'}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          position: { xs: 'fixed', sm: 'static' },
          left: { xs: 0, sm: 'auto' },
          right: { xs: 0, sm: 'auto' },
          bottom: { xs: 0, sm: 'auto' },
          p: { xs: 2, sm: 0 },
          mt: { sm: 1 },
          bgcolor: { xs: 'background.paper', sm: 'transparent' },
          borderTop: { xs: '1px solid', sm: 'none' },
          borderColor: { xs: 'grey.200', sm: 'transparent' },
          zIndex: 1,
        }}
      >
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{ fontWeight: 700, textTransform: 'none', py: 1.25, borderRadius: 2 }}
        >
          {initialData ? 'Zapisz zmiany' : 'Dodaj książkę'}
        </Button>
      </Box>
    </Box>
  );
};

export default BookForm;
