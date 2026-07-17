// Barrel exports for types
export type { Book, BookStatus, BookFormData, BookToAdd, BookUpdateData } from './Book';
export type { User } from './User';
export type { 
  AppError, 
  ValidationError, 
  FirebaseError, 
  NetworkError, 
  ErrorType, 
} from './Error';
export type {
  Movie,
  MovieGenre,
  MovieFilters,
  MovieDiscoverResponse,
  MovieSortBy,
  TmdbEntityRef,
  WatchProvider,
} from './Movie';
export type { WatchlistMovie, WatchlistMovieInput } from './WatchlistMovie';
