import React, { useEffect, useState } from 'react';
import { GENRES } from '../../../constants/genres';
import { BOOK_STATUSES, BOOK_STATUS_LABELS } from '../../../constants/bookStatus';
import type { Book, BookStatus, BookFormData } from '../../../types/Book';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookFormSchema } from '../../../schemas/bookSchema';
import { Sparkles, Search, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import {
  searchOpenLibraryBooksByQuery,
  type OpenLibraryQuickBook,
} from '../../../services/openLibraryService';
import { useDebounce } from '../../../hooks/useDebounce';
import { Input } from '../../ui/input';
import { Select } from '../../ui/select';
import { Button } from '../../ui/button';
import { Rating } from '../../ui/rating';

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

function matchSubjectToGenre(subjects?: string[]): string {
  if (!subjects || subjects.length === 0) return 'Inne';
  const joined = subjects.join(' ').toLowerCase();
  if (joined.includes('fantasy') || joined.includes('magic')) return 'Fantasy';
  if (joined.includes('science fiction') || joined.includes('sci-fi')) return 'Science-Fiction';
  if (joined.includes('thriller') || joined.includes('suspense')) return 'Thriller';
  if (joined.includes('crime') || joined.includes('detective') || joined.includes('mystery')) return 'Kryminał';
  if (joined.includes('romance') || joined.includes('love')) return 'Romans';
  if (joined.includes('history') || joined.includes('historical')) return 'Historia';
  if (joined.includes('biography') || joined.includes('memoir')) return 'Biografia';
  if (joined.includes('horror')) return 'Horror';
  if (joined.includes('business') || joined.includes('economics')) return 'Biznes i ekonomia';
  if (joined.includes('philosophy')) return 'Filozofia';
  if (joined.includes('science')) return 'Nauki ścisłe';
  if (joined.includes('psychology') || joined.includes('self-help')) return 'Psychologia';
  return 'Inne';
}

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

export const BookForm: React.FC<Props> = ({
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

  // Open Library quick search state
  const [olQuery, setOlQuery] = useState('');
  const [olResults, setOlResults] = useState<OpenLibraryQuickBook[]>([]);
  const [olLoading, setOlLoading] = useState(false);
  const [olShowSearch, setOlShowSearch] = useState(!initialData);
  const debouncedOlQuery = useDebounce(olQuery, 400);

  useEffect(() => {
    if (!debouncedOlQuery || debouncedOlQuery.trim().length < 2) {
      setOlResults([]);
      return;
    }
    let cancelled = false;
    setOlLoading(true);
    searchOpenLibraryBooksByQuery(debouncedOlQuery, 6)
      .then((res) => {
        if (!cancelled) setOlResults(res);
      })
      .catch(() => {
        if (!cancelled) setOlResults([]);
      })
      .finally(() => {
        if (!cancelled) setOlLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedOlQuery]);

  const handleSelectOlBook = (book: OpenLibraryQuickBook) => {
    setValue('title', book.title, { shouldValidate: true, shouldDirty: true });
    setValue('author', book.author, { shouldValidate: true, shouldDirty: true });
    if (book.pages) {
      setValue('overallPages', Math.min(Math.max(book.pages, 1), 5000), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (book.cover) {
      setValue('cover', book.cover, { shouldValidate: true, shouldDirty: true });
    }
    if (book.rating) {
      setValue('rating', book.rating, { shouldValidate: true, shouldDirty: true });
    }
    const guessedGenre = matchSubjectToGenre(book.subjects);
    if (guessedGenre) {
      setValue('genre', guessedGenre, { shouldValidate: true, shouldDirty: true });
    }
    setOlResults([]);
    setOlQuery('');
  };

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {Object.keys(errors).length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>Proszę poprawić błędy w formularzu</span>
        </div>
      )}

      {olShowSearch && !initialData && (
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-dashed border-indigo-200 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Szybkie uzupełnianie z Open Library
            </span>
            <button
              type="button"
              onClick={() => setOlShowSearch(false)}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Ukryj
            </button>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Wpisz tytuł lub autora (np. Wiedźmin, Tolkien)..."
              value={olQuery}
              onChange={(e) => setOlQuery(e.target.value)}
              className="h-9 w-full rounded-xl border border-indigo-200 bg-white pl-9 pr-8 text-xs text-slate-900 shadow-2xs focus:border-indigo-500 focus:outline-none"
            />
            {olLoading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
              </div>
            )}
          </div>

          {olResults.length > 0 && (
            <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 divide-y divide-slate-100 shadow-lg">
              {olResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectOlBook(item)}
                  className="p-2 flex items-center gap-2.5 hover:bg-indigo-50/50 cursor-pointer rounded-lg transition-colors"
                >
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt=""
                      className="w-7 h-10 object-cover rounded shrink-0 shadow-2xs"
                    />
                  ) : (
                    <div className="w-7 h-10 bg-slate-100 rounded flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.author} {item.pages ? `· ${item.pages} str.` : ''} {item.year ? `(${item.year})` : ''}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-[11px] px-2">
                    Wybierz
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="book-title-input" className="block text-xs font-bold text-slate-700 mb-1">
          Tytuł *
        </label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="book-title-input"
              placeholder="np. Władca Pierścieni"
              error={!!errors.title}
            />
          )}
        />
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Author */}
      <div>
        <label htmlFor="book-author-input" className="block text-xs font-bold text-slate-700 mb-1">
          Autor *
        </label>
        <Controller
          name="author"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="book-author-input"
              placeholder="np. J.R.R. Tolkien"
              error={!!errors.author}
            />
          )}
        />
        {errors.author && (
          <p className="text-xs text-red-500 mt-1">{errors.author.message}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="book-status-input" className="block text-xs font-bold text-slate-700 mb-1">
          Status czytania *
        </label>
        <Controller
          name="read"
          control={control}
          render={({ field }) => (
            <Select {...field} id="book-status-input" error={!!errors.read}>
              {BOOK_STATUSES.map((status: BookStatus) => (
                <option key={status} value={status}>
                  {BOOK_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          )}
        />
        {errors.read && (
          <p className="text-xs text-red-500 mt-1">{errors.read.message}</p>
        )}
      </div>

      {/* Genre */}
      <div>
        <label htmlFor="book-genre-input" className="block text-xs font-bold text-slate-700 mb-1">
          Gatunek *
        </label>
        <Controller
          name="genre"
          control={control}
          render={({ field }) => (
            <Select {...field} id="book-genre-input" error={!!errors.genre}>
              <option value="">Wybierz gatunek...</option>
              {genreOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        />
        {errors.genre && (
          <p className="text-xs text-red-500 mt-1">{errors.genre.message}</p>
        )}
      </div>

      {/* Pages: read & overall */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="book-read-pages-input" className="block text-xs font-bold text-slate-700 mb-1">
            Przeczytane strony
          </label>
          <Controller
            name="readPages"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="book-read-pages-input"
                type="number"
                min={0}
                max={5000}
                error={!!errors.readPages}
                onChange={(e) =>
                  field.onChange(e.target.value === '' ? 0 : Number(e.target.value))
                }
              />
            )}
          />
          {errors.readPages && (
            <p className="text-xs text-red-500 mt-1">{errors.readPages.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="book-overall-pages-input" className="block text-xs font-bold text-slate-700 mb-1">
            Liczba stron *
          </label>
          <Controller
            name="overallPages"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="book-overall-pages-input"
                type="number"
                min={1}
                max={5000}
                error={!!errors.overallPages}
                onChange={(e) =>
                  field.onChange(e.target.value === '' ? 1 : Number(e.target.value))
                }
              />
            )}
          />
          {errors.overallPages && (
            <p className="text-xs text-red-500 mt-1">{errors.overallPages.message}</p>
          )}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Twoja ocena
        </label>
        <div className="flex items-center gap-3">
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <Rating
                value={Number(field.value) / 2}
                size="md"
                onChange={(_, value) => field.onChange((value ?? 0) * 2)}
              />
            )}
          />
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <span className="text-xs font-bold text-slate-600">
                {Number(field.value).toFixed(1)} / 10
              </span>
            )}
          />
        </div>
      </div>

      {/* Cover URL */}
      <div>
        <label htmlFor="book-cover-input" className="block text-xs font-bold text-slate-700 mb-1">
          URL okładki
        </label>
        <Controller
          name="cover"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="book-cover-input"
              placeholder="https://images.unsplash.com/..."
              data-testid="cover-input"
              error={!!errors.cover}
            />
          )}
        />
        {errors.cover && (
          <p className="text-xs text-red-500 mt-1">{errors.cover.message}</p>
        )}
      </div>

      {/* Cover preview */}
      {showCoverPreview && (
        <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
          <div className="w-12 h-16 rounded-md overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center">
            {coverBroken ? (
              <BookOpen className="w-5 h-5 text-slate-400" />
            ) : (
              <img
                src={coverUrl}
                alt="Podgląd okładki"
                onError={() => setCoverBroken(true)}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {coverBroken ? 'Nie udało się wczytać obrazu — sprawdź URL' : 'Podgląd okładki'}
          </span>
        </div>
      )}

      {/* Submit button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 text-sm font-bold"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          <span>{initialData ? 'Zapisz zmiany' : 'Dodaj książkę'}</span>
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
