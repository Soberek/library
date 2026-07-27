export type EbookAccess = 'no_ebook' | 'borrowable' | 'public' | 'printdisabled' | string;

export interface LotteryBook {
  id: string;
  title: string;
  author: string;
  authors: string[];
  cover?: string;
  year?: number | null;
  subjects?: string[];
  rating?: number | null;
  ratingsCount?: number | null;
  pages?: number | null;
  editionCount?: number | null;
  ebookAccess?: EbookAccess | null;
  languages?: string[];
  publishers?: string[];
  openLibraryUrl?: string;
}

export interface BookLotteryFilters {
  subject: string;
  language: string;
  yearFrom: number | null;
  yearTo: number | null;
  /** Open Library scale ~1–5; 0 = bez progu (średnia filtrowana lokalnie). */
  minRating: number;
  /** Min. liczba ocen w OL — działa w zapytaniu Solr. */
  minRatingsCount: number;
  /** Min. liczba wydań — działa w zapytaniu Solr. */
  minEditions: number;
  /** Min. mediany stron; 0 = bez limitu. */
  minPages: number;
  requireCover: boolean;
}

export interface LotterySearchResult {
  books: LotteryBook[];
  numFound: number;
}
