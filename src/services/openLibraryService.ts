import type { BookLotteryFilters, LotteryBook } from '../types/LotteryBook';

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

interface OpenLibraryDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
  ratings_average?: number;
  language?: string[];
}

interface OpenLibrarySearchResponse {
  numFound?: number;
  docs?: OpenLibraryDoc[];
}

function coverUrl(coverId: number | undefined, size: 'M' | 'L' = 'M'): string | undefined {
  if (!coverId) return undefined;
  return `${COVER_BASE}/${coverId}-${size}.jpg`;
}

function mapDoc(doc: OpenLibraryDoc): LotteryBook | null {
  if (!doc.key || !doc.title) return null;
  const id = doc.key.replace('/works/', '').replace('/books/', '');
  return {
    id,
    title: doc.title,
    author: doc.author_name?.[0] ?? 'Nieznany autor',
    cover: coverUrl(doc.cover_i, 'L'),
    year: doc.first_publish_year ?? null,
    subjects: doc.subject?.slice(0, 6) ?? [],
    rating: doc.ratings_average ?? null,
    openLibraryUrl: `https://openlibrary.org${doc.key}`,
  };
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
  if (parts.length === 0) {
    // Prefer titles that have some rating traction so random draws aren't empty stubs
    parts.push('ratings_count:[1 TO *]');
  }
  return parts.join(' ');
}

export async function searchLotteryBooks(
  filters: BookLotteryFilters,
  limit = 24,
): Promise<LotteryBook[]> {
  const params = new URLSearchParams({
    q: buildQuery(filters),
    sort: 'random',
    limit: String(limit),
    fields: [
      'key',
      'title',
      'author_name',
      'cover_i',
      'first_publish_year',
      'subject',
      'ratings_average',
      'language',
    ].join(','),
  });

  const response = await fetch(`${SEARCH_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Open Library zwróciło błąd (${response.status}). Spróbuj ponownie.`);
  }

  const data = (await response.json()) as OpenLibrarySearchResponse;
  let books = (data.docs ?? [])
    .map(mapDoc)
    .filter((book): book is LotteryBook => book !== null);

  if (filters.requireCover) {
    books = books.filter((b) => Boolean(b.cover));
  }

  return books;
}

export async function pickRandomLotteryBook(
  filters: BookLotteryFilters,
  excludeIds: Set<string> = new Set(),
): Promise<{ winner: LotteryBook; reel: LotteryBook[] }> {
  // A few random pages/requests improve variety
  const batches = await Promise.all([
    searchLotteryBooks(filters, 20),
    searchLotteryBooks(filters, 20),
  ]);

  const byId = new Map<string, LotteryBook>();
  for (const book of batches.flat()) {
    byId.set(book.id, book);
  }
  const pool = Array.from(byId.values());

  if (pool.length === 0) {
    throw new Error('Brak książek dla wybranych filtrów. Poluzuj kryteria i spróbuj ponownie.');
  }

  const candidates = pool.filter((b) => !excludeIds.has(b.id));
  const source = candidates.length > 0 ? candidates : pool;
  const winner = source[Math.floor(Math.random() * source.length)];

  return { winner, reel: pool };
}
