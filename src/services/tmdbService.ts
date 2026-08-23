import { TMDB_API_KEY } from '../config/env';
import type {
  Movie,
  MovieDiscoverResponse,
  MovieFilters,
  MovieGenre,
  TmdbEntityRef,
  WatchProvider,
} from '../types/Movie';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE = 'https://image.tmdb.org/t/p';

function getApiKey(): string {
  if (!TMDB_API_KEY?.trim()) {
    throw new Error(
      'Brak klucza TMDB. Dodaj VITE_TMDB_API_KEY do pliku .env (darmowy klucz: themoviedb.org/settings/api).',
    );
  }
  return TMDB_API_KEY.trim();
}

export function hasTmdbApiKey(): boolean {
  return Boolean(TMDB_API_KEY?.trim());
}

export function posterUrl(
  path: string | null | undefined,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' = 'w500',
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE}/${size}${path}`;
}

export function backdropUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE}/w1280${path}`;
}

export function providerLogoUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE}/w92${path}`;
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
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

export async function searchPeople(query: string): Promise<TmdbEntityRef[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<{ results: { id: number; name: string }[] }>('/search/person', {
    query: query.trim(),
    include_adult: 'false',
  });
  return data.results.slice(0, 8).map((p) => ({ id: p.id, name: p.name }));
}

export async function searchCompanies(query: string): Promise<TmdbEntityRef[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<{ results: { id: number; name: string }[] }>('/search/company', {
    query: query.trim(),
  });
  return data.results.slice(0, 8).map((c) => ({ id: c.id, name: c.name }));
}

export async function fetchWatchProviders(region: string): Promise<WatchProvider[]> {
  const data = await tmdbFetch<{
    results: WatchProvider[];
  }>('/watch/providers/movie', {
    watch_region: region,
  });

  return [...data.results]
    .sort((a, b) => a.provider_name.localeCompare(b.provider_name, 'pl'))
    .slice(0, 40);
}

function buildDiscoverParams(
  filters: MovieFilters,
  page: number,
): Record<string, string | number | undefined> {
  return {
    page,
    include_adult: 'false',
    sort_by: filters.sortBy,
    with_genres: filters.genreId ?? undefined,
    without_genres: filters.excludeGenreId ?? undefined,
    'primary_release_date.gte': filters.yearFrom ? `${filters.yearFrom}-01-01` : undefined,
    'primary_release_date.lte': filters.yearTo ? `${filters.yearTo}-12-31` : undefined,
    'vote_average.gte': filters.minRating > 0 ? filters.minRating : undefined,
    'vote_average.lte': filters.maxRating ?? undefined,
    'vote_count.gte': filters.minVotes,
    'with_runtime.gte': filters.runtimeMin ?? undefined,
    'with_runtime.lte': filters.runtimeMax ?? undefined,
    with_original_language: filters.originalLanguage ?? undefined,
    with_origin_country: filters.originCountry ?? undefined,
    with_cast: filters.castId ?? undefined,
    with_crew: filters.crewId ?? undefined,
    with_companies: filters.companyId ?? undefined,
    with_watch_providers: filters.watchProviderId ?? undefined,
    watch_region: filters.watchProviderId ? filters.watchRegion : undefined,
    certification: filters.certification ?? undefined,
    certification_country: filters.certification
      ? filters.certificationCountry
      : undefined,
  };
}

export async function discoverMovies(
  filters: MovieFilters,
  page: number,
): Promise<MovieDiscoverResponse> {
  return tmdbFetch<MovieDiscoverResponse>('/discover/movie', buildDiscoverParams(filters, page));
}

export async function fetchMovieDetails(
  movieId: number,
): Promise<{
  runtime?: number;
  tagline?: string;
  director?: string;
  overview?: string;
  trailer_key?: string;
  watch_providers?: WatchProvider[];
}> {
  try {
    interface TmdbDetailResponse {
      runtime?: number;
      tagline?: string;
      overview?: string;
      credits?: {
        crew?: { job: string; name: string }[];
      };
      videos?: {
        results?: { key: string; site: string; type: string; official?: boolean }[];
      };
      'watch/providers'?: {
        results?: {
          PL?: {
            flatrate?: { provider_id: number; provider_name: string; logo_path: string | null }[];
          };
        };
      };
    }

    const data = await tmdbFetch<TmdbDetailResponse>(`/movie/${movieId}`, {
      append_to_response: 'credits,videos,watch/providers',
    });

    const director = data.credits?.crew?.find((c) => c.job === 'Director')?.name;
    let overview = data.overview;
    let trailerKey = data.videos?.results?.find(
      (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
    )?.key;

    // Fallback: If Polish overview or trailer is empty, fetch English details
    if (!overview || overview.trim() === '' || !trailerKey) {
      try {
        const apiKey = getApiKey();
        const enUrl = new URL(`${TMDB_BASE}/movie/${movieId}`);
        enUrl.searchParams.set('api_key', apiKey);
        enUrl.searchParams.set('language', 'en-US');
        enUrl.searchParams.set('append_to_response', 'videos');
        const enRes = await fetch(enUrl.toString());
        if (enRes.ok) {
          const enData = (await enRes.json()) as {
            overview?: string;
            videos?: { results?: { key: string; site: string; type: string }[] };
          };
          if (!overview || overview.trim() === '') {
            overview = enData.overview;
          }
          if (!trailerKey) {
            trailerKey = enData.videos?.results?.find(
              (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
            )?.key;
          }
        }
      } catch {
        // ignore fallback errors
      }
    }

    const plProviders = data['watch/providers']?.results?.PL?.flatrate?.map((p) => ({
      provider_id: p.provider_id,
      provider_name: p.provider_name,
      logo_path: p.logo_path,
    }));

    return {
      runtime: data.runtime,
      tagline: data.tagline,
      director,
      overview: overview || undefined,
      trailer_key: trailerKey,
      watch_providers: plProviders && plProviders.length > 0 ? plProviders : undefined,
    };
  } catch {
    return {};
  }
}

export async function pickRandomMovie(
  filters: MovieFilters,
  excludeIds: Set<number> = new Set(),
): Promise<Movie> {
  const firstPage = await discoverMovies(filters, 1);

  if (firstPage.total_results === 0 || firstPage.results.length === 0) {
    throw new Error('Brak filmów dla wybranych filtrów. Poluzuj kryteria i spróbuj ponownie.');
  }

  // Only sample from the top-quality pages
  const maxSamplePage = Math.min(
    firstPage.total_pages,
    filters.minVotes >= 500 ? 5 : filters.minVotes >= 100 ? 8 : 12,
  );

  const pagesToFetch = new Set<number>([1]);
  const sampleCount = Math.min(3, maxSamplePage);
  while (pagesToFetch.size < sampleCount) {
    const randomPage = Math.floor(Math.random() * maxSamplePage) + 1;
    pagesToFetch.add(randomPage);
  }

  const responses = await Promise.all(
    Array.from(pagesToFetch).map((p) =>
      p === 1 ? Promise.resolve(firstPage) : discoverMovies(filters, p).catch(() => null),
    ),
  );

  let allFetched = responses.flatMap((r) => r?.results ?? []);

  // Filter high-quality candidates:
  // 1. Must have poster path
  // 2. NOT in excludeIds
  // 3. Decent popularity & vote count
  let candidates = allFetched.filter(
    (m) =>
      m.poster_path &&
      !excludeIds.has(m.id) &&
      m.vote_count >= Math.max(10, filters.minVotes / 2),
  );

  // If initial batch was all excluded, fetch remaining top pages to find unseen movies
  if (candidates.length === 0 && maxSamplePage > pagesToFetch.size) {
    const nextPages = Array.from({ length: maxSamplePage }, (_, i) => i + 1).filter(
      (p) => !pagesToFetch.has(p),
    );
    const extraResponses = await Promise.all(
      nextPages.slice(0, 4).map((p) => discoverMovies(filters, p).catch(() => null)),
    );
    const extraFetched = extraResponses.flatMap((r) => r?.results ?? []);
    allFetched = [...allFetched, ...extraFetched];
    candidates = allFetched.filter(
      (m) =>
        m.poster_path &&
        !excludeIds.has(m.id) &&
        m.vote_count >= Math.max(10, filters.minVotes / 2),
    );
  }

  // If still empty (all unseen exhausted), check if non-excluded movies with poster exist
  if (candidates.length === 0) {
    candidates = allFetched.filter((m) => m.poster_path && !excludeIds.has(m.id));
  }

  // If literally all movies are excluded in these filters, inform user or fallback
  if (candidates.length === 0) {
    candidates = allFetched.filter((m) => m.poster_path);
  }

  if (candidates.length === 0) {
    throw new Error('Wszystkie filmy z tej kategorii zostały już przez Ciebie obejrzane! Zmień filtry lub zresetuj listę.');
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  // Enrich with runtime, director, and fallback overview
  try {
    const details = await fetchMovieDetails(picked.id);
    return {
      ...picked,
      ...details,
      overview: details.overview || picked.overview,
    };
  } catch {
    return picked;
  }
}

export function releaseYear(date: string | undefined): string {
  if (!date || date.length < 4) return '—';
  return date.slice(0, 4);
}

export function formatRuntime(minutes?: number): string {
  if (!minutes || minutes <= 0) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }
  return `${mins} min`;
}

export function countAdvancedFilters(filters: MovieFilters): number {
  let count = 0;
  if (filters.maxRating !== null) count += 1;
  if (filters.runtimeMin !== null || filters.runtimeMax !== null) count += 1;
  if (filters.originalLanguage) count += 1;
  if (filters.originCountry) count += 1;
  if (filters.excludeGenreId !== null) count += 1;
  if (filters.sortBy !== 'popularity.desc') count += 1;
  if (filters.castId !== null) count += 1;
  if (filters.crewId !== null) count += 1;
  if (filters.companyId !== null) count += 1;
  if (filters.watchProviderId !== null) count += 1;
  if (filters.certification) count += 1;
  return count;
}
