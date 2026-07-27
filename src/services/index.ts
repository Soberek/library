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
  BOOK_LOTTERY_SUBJECTS,
  BOOK_LOTTERY_LANGUAGES,
} from './openLibraryService';

export {
  getUserWatchlist,
  addToWatchlist,
  setWatchlistWatched,
  removeFromWatchlist,
  movieToWatchlistInput,
} from './watchlistService';
