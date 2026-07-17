export interface MovieGenre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  popularity: number;
}

export interface MovieDiscoverResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type MovieSortBy =
  | 'popularity.desc'
  | 'popularity.asc'
  | 'vote_average.desc'
  | 'vote_average.asc'
  | 'primary_release_date.desc'
  | 'primary_release_date.asc'
  | 'vote_count.desc';

export interface TmdbEntityRef {
  id: number;
  name: string;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

export interface MovieFilters {
  genreId: number | null;
  yearFrom: number | null;
  yearTo: number | null;
  minRating: number;
  minVotes: number;
  // Advanced
  maxRating: number | null;
  runtimeMin: number | null;
  runtimeMax: number | null;
  originalLanguage: string | null;
  originCountry: string | null;
  excludeGenreId: number | null;
  sortBy: MovieSortBy;
  castId: number | null;
  castName: string | null;
  crewId: number | null;
  crewName: string | null;
  companyId: number | null;
  companyName: string | null;
  watchProviderId: number | null;
  watchRegion: string;
  certification: string | null;
  certificationCountry: string;
}
