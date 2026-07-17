import type {
  Movie,
  MovieDiscoverResponse,
  MovieFilters,
  MovieGenre,
} from '../types/Movie';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE = 'https://image.tmdb.org/t/p';

function getApiKey(): string {
  const key = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
  if (!key?.trim()) {
    throw new Error(
      'Brak klucza TMDB. Dodaj VITE_TMDB_API_KEY do pliku .env (darmowy klucz: themoviedb.org/settings/api).',
    );
  }
  return key.trim();
}

export function hasTmdbApiKey(): boolean {
  return Boolean((import.meta.env.VITE_TMDB_API_KEY as string | undefined)?.trim());
}

export function posterUrl(path: string | null, size: 'w342' | 'w500' | 'w780' = 'w500'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE}/${size}${path}`;
}

export function backdropUrl(path: string | null): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE}/w1280${path}`;
}

async function tmdbFetch<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const apiKey = getApiKey();
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'pl-PL');

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Nieprawidłowy klucz TMDB. Sprawdź VITE_TMDB_API_KEY w .env.');
    }
    throw new Error(`TMDB zwróciło błąd (${response.status}). Spróbuj ponownie.`);
  }

  return response.json() as Promise<T>;
}

export async function fetchMovieGenres(): Promise<MovieGenre[]> {
  const data = await tmdbFetch<{ genres: MovieGenre[] }>('/genre/movie/list');
  return data.genres;
}

function buildDiscoverParams(filters: MovieFilters, page: number): Record<string, string | number | undefined> {
  return {
    page,
    include_adult: 'false',
    sort_by: 'popularity.desc',
    with_genres: filters.genreId ?? undefined,
    'primary_release_date.gte': filters.yearFrom ? `${filters.yearFrom}-01-01` : undefined,
    'primary_release_date.lte': filters.yearTo ? `${filters.yearTo}-12-31` : undefined,
    'vote_average.gte': filters.minRating > 0 ? filters.minRating : undefined,
    'vote_count.gte': filters.minVotes,
  };
}

export async function discoverMovies(
  filters: MovieFilters,
  page: number,
): Promise<MovieDiscoverResponse> {
  return tmdbFetch<MovieDiscoverResponse>('/discover/movie', buildDiscoverParams(filters, page));
}

export async function pickRandomMovie(
  filters: MovieFilters,
  excludeIds: Set<number> = new Set(),
): Promise<Movie> {
  const firstPage = await discoverMovies(filters, 1);

  if (firstPage.total_results === 0 || firstPage.results.length === 0) {
    throw new Error('Brak filmów dla wybranych filtrów. Poluzuj kryteria i spróbuj ponownie.');
  }

  // TMDB caps discover at page 500
  const maxPage = Math.min(firstPage.total_pages, 500);
  const attempts = Math.min(8, maxPage);

  for (let i = 0; i < attempts; i++) {
    const page = Math.floor(Math.random() * maxPage) + 1;
    const data = page === 1 ? firstPage : await discoverMovies(filters, page);
    const candidates = data.results.filter((m) => !excludeIds.has(m.id));
    const pool = candidates.length > 0 ? candidates : data.results;

    if (pool.length > 0) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }

  throw new Error('Nie udało się wylosować filmu. Spróbuj ponownie.');
}

export function releaseYear(date: string | undefined): string {
  if (!date || date.length < 4) return '—';
  return date.slice(0, 4);
}
