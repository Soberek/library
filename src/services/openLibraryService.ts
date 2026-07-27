import type {
  BookLotteryFilters,
  LotteryBook,
  LotterySearchResult,
} from '../types/LotteryBook';

const SEARCH_URL = 'https://openlibrary.org/search.json';
const COVER_BASE = 'https://covers.openlibrary.org/b/id';

export const BOOK_LOTTERY_SUBJECTS: { value: string; label: string }[] = [
  { value: '', label: 'Wszystkie' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'science fiction', label: 'Science fiction' },
  { value: 'mystery', label: 'Kryminał / mystery' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'romance', label: 'Romans' },
  { value: 'horror', label: 'Horror' },
  { value: 'historical fiction', label: 'Historyczna' },
  { value: 'biography', label: 'Biografia' },
  { value: 'poetry', label: 'Poezja' },
  { value: 'philosophy', label: 'Filozofia' },
  { value: 'psychology', label: 'Psychologia' },
  { value: 'history', label: 'Historia' },
  { value: 'adventure', label: 'Przygodowa' },
  { value: 'young adult', label: 'Young adult' },
  { value: 'classic literature', label: 'Klasyka' },
  { value: 'humor', label: 'Humor' },
];

export const BOOK_LOTTERY_LANGUAGES: { code: string; label: string }[] = [
  { code: '', label: 'Dowolny' },
  { code: 'pol', label: 'Polski' },
  { code: 'eng', label: 'Angielski' },
  { code: 'ger', label: 'Niemiecki' },
  { code: 'fre', label: 'Francuski' },
  { code: 'spa', label: 'Hiszpański' },
  { code: 'ita', label: 'Włoski' },
  { code: 'rus', label: 'Rosyjski' },
  { code: 'jpn', label: 'Japoński' },
];

export const BOOK_RATING_COUNT_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Dowolnie' },
  { value: 1, label: '≥1' },
  { value: 5, label: '≥5' },
  { value: 10, label: '≥10' },
  { value: 25, label: '≥25' },
];

/** Progi want_to_read_count (popularność w Open Library). */
export const BOOK_POPULARITY_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Luźno' },
  { value: 50, label: 'Środek' },
  { value: 500, label: 'Znane' },
  { value: 2000, label: 'Hity' },
];

export const BOOK_EDITION_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Dowolnie' },
  { value: 2, label: '≥2' },
  { value: 5, label: '≥5' },
  { value: 15, label: '≥15' },
];

export const BOOK_PAGES_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Dowolnie' },
  { value: 150, label: '≥150' },
  { value: 250, label: '≥250' },
  { value: 400, label: '≥400' },
];

const LANGUAGE_LABELS: Record<string, string> = {
  pol: 'polski',
  eng: 'angielski',
  ger: 'niemiecki',
  fre: 'francuski',
  spa: 'hiszpański',
  ita: 'włoski',
  rus: 'rosyjski',
  jpn: 'japoński',
  dut: 'niderlandzki',
  por: 'portugalski',
  swe: 'szwedzki',
  chi: 'chiński',
  kor: 'koreański',
  heb: 'hebrajski',
  cze: 'czeski',
  hun: 'węgierski',
  ukr: 'ukraiński',
};

const POLISH_PUBLISHER_HINTS = [
  'mag',
  'rebis',
  'zysk',
  'amber',
  'albatros',
  'powergraph',
  'fabryka słów',
  'fabryka slow',
  'prószyński',
  'proszynski',
  'świat książki',
  'swiat ksiazki',
  'w.a.b',
  'wab',
  'muza',
  'czerwone i czarne',
  'sqn',
  'inkognito',
  'supernowa',
  'wydawnictwo literackie',
  'piw',
  'ossolineum',
];

interface OpenLibraryDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
  ratings_average?: number;
  ratings_count?: number;
  language?: string[];
  edition_count?: number;
  want_to_read_count?: number;
  ebook_access?: string;
  number_of_pages_median?: number;
  publisher?: string[];
}

interface OpenLibrarySearchResponse {
  numFound?: number;
  docs?: OpenLibraryDoc[];
}

function coverUrl(coverId: number | undefined, size: 'M' | 'L' = 'M'): string | undefined {
  if (!coverId) return undefined;
  return `${COVER_BASE}/${coverId}-${size}.jpg`;
}

/** Prefer short, human subjects; drop noisy catalog tags. */
export function pickDisplaySubjects(
  subjects: string[] | undefined,
  preferred?: string,
  limit = 3,
): string[] {
  if (!subjects?.length) return [];

  const cleaned = subjects
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => s.length <= 36)
    .filter((s) => !/^fiction[,/]/i.test(s))
    .filter((s) => !/^nyt:/i.test(s))
    .filter((s) => !/new york times/i.test(s))
    .filter((s) => !/reading level/i.test(s))
    .filter((s) => !/large type/i.test(s))
    .filter((s) => !/^FICTION \//i.test(s));

  const preferredLower = preferred?.toLowerCase();
  const ranked = [...cleaned].sort((a, b) => {
    const aHit = preferredLower && a.toLowerCase().includes(preferredLower) ? 1 : 0;
    const bHit = preferredLower && b.toLowerCase().includes(preferredLower) ? 1 : 0;
    if (aHit !== bHit) return bHit - aHit;
    return a.length - b.length;
  });

  const unique: string[] = [];
  for (const subject of ranked) {
    if (unique.some((u) => u.toLowerCase() === subject.toLowerCase())) continue;
    unique.push(subject);
    if (unique.length >= limit) break;
  }
  return unique;
}

export function languageLabel(code: string): string {
  return LANGUAGE_LABELS[code] ?? code;
}

export function ebookLabel(access: string | null | undefined): string | null {
  if (!access || access === 'no_ebook') return null;
  if (access === 'borrowable') return 'Do wypożyczenia';
  if (access === 'public') return 'Darmowy e-book';
  if (access === 'printdisabled') return 'Skan (ograniczony)';
  return null;
}

/** OL Solr nie filtruje wiarygodnie po ratings_average — średnia jest lokalnie. */
export function needsClientRatingFilter(filters: BookLotteryFilters): boolean {
  return filters.minRating > 0;
}

function hasPolishPublisher(publishers: string[] | undefined): boolean {
  if (!publishers?.length) return false;
  return publishers.some((p) => {
    const lower = p.toLowerCase();
    return POLISH_PUBLISHER_HINTS.some((hint) => lower.includes(hint));
  });
}

function languageFitScore(book: LotteryBook, language: string): number {
  if (!language) return 0;
  const langs = book.languages ?? [];
  if (langs.length === 0) return 0;
  if (langs.length === 1 && langs[0] === language) return 5;
  if (langs[0] === language) return 3;
  if (langs.includes(language)) return 1;
  return 0;
}

function pickScore(book: LotteryBook, filters: BookLotteryFilters): number {
  let score = 0;
  score += languageFitScore(book, filters.language);
  if (filters.language === 'pol' && hasPolishPublisher(book.publishers)) score += 2;
  if (book.cover) score += 1;
  if ((book.editionCount ?? 0) >= 5) score += 1;
  if ((book.editionCount ?? 0) >= 20) score += 1;
  if (book.rating != null) {
    if (book.rating >= filters.minRating) score += 1.5;
    if (book.rating >= 4) score += 1;
  }
  if ((book.ratingsCount ?? 0) >= 10) score += 0.5;
  if ((book.wantToReadCount ?? 0) >= filters.minPopularity) score += 1;
  if ((book.wantToReadCount ?? 0) >= 500) score += 0.5;
  if ((book.wantToReadCount ?? 0) >= 2000) score += 0.5;
  if (book.pages != null && book.pages >= 80) score += 0.5;
  return score;
}

function mapDoc(doc: OpenLibraryDoc, preferredSubject?: string): LotteryBook | null {
  if (!doc.key || !doc.title) return null;
  const id = doc.key.replace('/works/', '').replace('/books/', '');
  const authors = doc.author_name?.filter(Boolean) ?? [];
  return {
    id,
    title: doc.title,
    author: authors[0] ?? 'Nieznany autor',
    authors,
    cover: coverUrl(doc.cover_i, 'L'),
    year: doc.first_publish_year ?? null,
    subjects: pickDisplaySubjects(doc.subject, preferredSubject, 4),
    rating: doc.ratings_average ?? null,
    ratingsCount: doc.ratings_count ?? null,
    pages: doc.number_of_pages_median ?? null,
    editionCount: doc.edition_count ?? null,
    wantToReadCount: doc.want_to_read_count ?? null,
    ebookAccess: doc.ebook_access ?? null,
    languages: doc.language ?? [],
    publishers: doc.publisher?.slice(0, 8) ?? [],
    openLibraryUrl: `https://openlibrary.org${doc.key}`,
  };
}

function effectiveMinRatingsCount(filters: BookLotteryFilters): number {
  if (filters.minRatingsCount > 0) return filters.minRatingsCount;
  // Średnia bez żadnych głosów nie istnieje — wymuś ≥1 gdy jest próg oceny
  if (filters.minRating > 0) return 1;
  return 0;
}

function buildQuery(filters: BookLotteryFilters): string {
  const parts: string[] = [];
  if (filters.subject) {
    parts.push(`subject:"${filters.subject}"`);
  }
  if (filters.language) {
    parts.push(`language:${filters.language}`);
  }
  if (filters.yearFrom != null && filters.yearTo != null) {
    parts.push(`first_publish_year:[${filters.yearFrom} TO ${filters.yearTo}]`);
  } else if (filters.yearFrom != null) {
    parts.push(`first_publish_year:[${filters.yearFrom} TO *]`);
  } else if (filters.yearTo != null) {
    parts.push(`first_publish_year:[* TO ${filters.yearTo}]`);
  }
  if (filters.requireCover) {
    parts.push('cover_i:[* TO *]');
  }

  const minVotes = effectiveMinRatingsCount(filters);
  if (minVotes > 0) {
    parts.push(`ratings_count:[${minVotes} TO *]`);
  }
  if (filters.minPopularity > 0) {
    parts.push(`want_to_read_count:[${filters.minPopularity} TO *]`);
  }
  if (filters.minEditions > 0) {
    parts.push(`edition_count:[${filters.minEditions} TO *]`);
  }
  if (filters.minPages > 0) {
    parts.push(`number_of_pages_median:[${filters.minPages} TO *]`);
  }

  if (parts.length === 0) {
    parts.push('ratings_count:[1 TO *]');
  }
  return parts.join(' ');
}

const SEARCH_FIELDS = [
  'key',
  'title',
  'author_name',
  'cover_i',
  'first_publish_year',
  'subject',
  'ratings_average',
  'ratings_count',
  'language',
  'edition_count',
  'want_to_read_count',
  'ebook_access',
  'number_of_pages_median',
  'publisher',
].join(',');

function passesClientFilters(book: LotteryBook, filters: BookLotteryFilters): boolean {
  if (filters.minRating > 0) {
    if (book.rating == null || book.rating < filters.minRating) return false;
  }
  return true;
}

export async function searchLotteryBooks(
  filters: BookLotteryFilters,
  limit = 24,
  sort: 'random' | 'rating' | 'want_to_read' = 'random',
): Promise<LotterySearchResult> {
  const params = new URLSearchParams({
    q: buildQuery(filters),
    sort,
    limit: String(limit),
    fields: SEARCH_FIELDS,
  });

  const response = await fetch(`${SEARCH_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Open Library zwróciło błąd (${response.status}). Spróbuj ponownie.`);
  }

  const data = (await response.json()) as OpenLibrarySearchResponse;
  const books = (data.docs ?? [])
    .map((doc) => mapDoc(doc, filters.subject || undefined))
    .filter((book): book is LotteryBook => book !== null)
    .filter((book) => passesClientFilters(book, filters));

  return {
    books,
    numFound: data.numFound ?? books.length,
  };
}

/** Lightweight count for filter preview (limit=0 still returns numFound). */
export async function countLotteryBooks(filters: BookLotteryFilters): Promise<number> {
  const params = new URLSearchParams({
    q: buildQuery(filters),
    limit: '0',
  });
  const response = await fetch(`${SEARCH_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Open Library zwróciło błąd (${response.status}).`);
  }
  const data = (await response.json()) as OpenLibrarySearchResponse;
  return data.numFound ?? 0;
}

function weightedPick(books: LotteryBook[], filters: BookLotteryFilters): LotteryBook {
  const weights = books.map((b) => Math.max(1, pickScore(b, filters) + 1));
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < books.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return books[i];
  }
  return books[books.length - 1];
}

export async function pickRandomLotteryBook(
  filters: BookLotteryFilters,
  excludeIds: Set<string> = new Set(),
): Promise<{ winner: LotteryBook; reel: LotteryBook[]; numFound: number }> {
  const pageSize = needsClientRatingFilter(filters) ? 40 : filters.requireCover ? 24 : 20;

  // Random + top-rated batches → better chance of hitting minRating locally
  const requests: Promise<LotterySearchResult>[] = [
    searchLotteryBooks(filters, pageSize, 'random'),
    searchLotteryBooks(filters, pageSize, 'random'),
  ];
  if (needsClientRatingFilter(filters)) {
    requests.push(searchLotteryBooks(filters, pageSize, 'rating'));
  }
  if (filters.minPopularity >= 500) {
    requests.push(searchLotteryBooks(filters, pageSize, 'want_to_read'));
  }

  const batches = await Promise.all(requests);

  const byId = new Map<string, LotteryBook>();
  for (const book of batches.flatMap((b) => b.books)) {
    byId.set(book.id, book);
  }
  const pool = Array.from(byId.values());
  const numFound = Math.max(...batches.map((b) => b.numFound), pool.length);

  if (pool.length === 0) {
    throw new Error(
      needsClientRatingFilter(filters)
        ? 'Brak książek z taką oceną w próbce. Obniż próg, zmniejsz liczbę głosów albo zmień język.'
        : 'Brak książek dla wybranych filtrów. Odznacz okładkę, poluzuj edycje/strony albo zmień język.',
    );
  }

  const candidates = pool.filter((b) => !excludeIds.has(b.id));
  const source = candidates.length > 0 ? candidates : pool;
  const winner = weightedPick(source, filters);

  const reel = [...pool].sort(
    (a, b) => pickScore(b, filters) - pickScore(a, filters),
  );

  return { winner, reel, numFound };
}
