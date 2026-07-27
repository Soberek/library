// Barrel exports for services
export { 
  getUserBooksData, 
  getAllBooksData, 
  addBook, 
  deleteBook, 
  updateBook, 
} from './booksService';

export {
  hasTmdbApiKey,
  fetchMovieGenres,
  discoverMovies,
  pickRandomMovie,
  posterUrl,
  backdropUrl,
  releaseYear,
  searchPeople,
  searchCompanies,
  fetchWatchProviders,
  providerLogoUrl,
  countAdvancedFilters,
} from './tmdbService';

export {
  searchLotteryBooks,
  pickRandomLotteryBook,
  countLotteryBooks,
  countAdvancedBookFilters,
  BOOK_LOTTERY_SUBJECTS,
  BOOK_LOTTERY_LANGUAGES,
  BOOK_RATING_COUNT_OPTIONS,
  BOOK_POPULARITY_OPTIONS,
  BOOK_EDITION_OPTIONS,
  BOOK_PAGES_OPTIONS,
} from './openLibraryService';

export {
  getUserWatchlist,
  addToWatchlist,
  setWatchlistWatched,
  removeFromWatchlist,
  movieToWatchlistInput,
} from './watchlistService';
