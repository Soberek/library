import type {
  BookLotteryFilters,
  BookMoodPreset,
  LotteryBook,
  LotterySearchResult,
} from '../types/LotteryBook';

const SEARCH_URL = 'https://openlibrary.org/search.json';
const COVER_BASE = 'https://covers.openlibrary.org/b/id';
const WORKS_BASE = 'https://openlibrary.org/works';

export const BOOK_MOOD_PRESETS: BookMoodPreset[] = [
  {
    id: 'cozy',
    label: 'Przytulny wieczór',
    icon: '☕',
    description: 'Kojąca lektura do herbaty, ciepły obyczaj, romans lub pełne humoru opowieści.',
    tagline: 'Ciepły kocyk i herbata',
    filters: {
      subject: 'fiction',
      minRating: 3.5,
      minPopularity: 50,
      requireCover: true,
    },
  },
  {
    id: 'noir',
    label: 'Mroczny kryminał',
    icon: '🕯️',
    description: 'Mroczne śledztwa, tajemnice zbrodni, duszny suspens i thrillery trzymające w napięciu.',
    tagline: 'Tajemnice, zbrodnie i dreszcz',
    filters: {
      subject: 'mystery',
      minRating: 3.5,
      minPopularity: 50,
      minPages: 200,
      requireCover: true,
    },
  },
  {
    id: 'fantasy',
    label: 'Magiczne fantasy',
    icon: '✨',
    description: 'Epickie krainy, pradawna magia, mity, baśnie i niezwykłe przygody bohaterów.',
    tagline: 'Smoki, czary i epickie światy',
    filters: {
      subject: 'fantasy',
      minRating: 3.8,
      minPopularity: 50,
      minPages: 250,
      requireCover: true,
    },
  },
  {
    id: 'classics',
    label: 'Mądra klasyka',
    icon: '🧠',
    description: 'Ponadczasowe dzieła literatury pięknej, głęboka filozofia i powieści kształtujące epoki.',
    tagline: 'Arcydzieła literatury światowej',
    filters: {
      subject: 'classic literature',
      yearTo: 1990,
      minEditions: 5,
      minRating: 3.5,
      requireCover: true,
    },
  },
  {
    id: 'scifi',
    label: 'Odległe światy',
    icon: '🚀',
    description: 'Kosmiczne wyprawy, wizje przyszłości, dystopie, cyberpunki i zderzenia z nieznanym.',
    tagline: 'Kosmos, technologia i dystopia',
    filters: {
      subject: 'science fiction',
      minRating: 3.5,
      minPopularity: 50,
      requireCover: true,
    },
  },
  {
    id: 'polish',
    label: 'Polska literatura',
    icon: '🇵🇱',
    description: 'Wybitna proza polska, wciągające powieści naszych autorów i klasyczne historie.',
    tagline: 'Dobre pióro w rodzimym języku',
    filters: {
      subject: 'Polish literature',
      language: 'pol',
      minRating: 3.0,
      requireCover: true,
    },
  },
  {
    id: 'nonfiction',
    label: 'Prawdziwe historie',
    icon: '📜',
    description: 'Biografie wielkich postaci, fascynujące fakty historyczne, wspomnienia i reportaże.',
    tagline: 'Fakty, ludzie i historia',
    filters: {
      subject: 'biography',
      minRating: 3.5,
      minPopularity: 0,
      requireCover: true,
    },
  },
];

export const BOOK_LOTTERY_SUBJECTS: {
  value: string;
  label: string;
  group?: string;
}[] = [
  { value: '', label: 'Wszystkie' },

  // Proza / fikcja
  { value: 'literary fiction', label: 'Literatura piękna', group: 'Proza' },
  { value: 'fiction', label: 'Fikcja (ogólna)', group: 'Proza' },
  { value: 'Polish fiction', label: 'Proza polska', group: 'Proza' },
  { value: 'Polish literature', label: 'Literatura polska', group: 'Proza' },
  { value: 'classic literature', label: 'Klasyka', group: 'Proza' },
  { value: 'short stories', label: 'Opowiadania', group: 'Proza' },
  { value: 'novels', label: 'Powieść', group: 'Proza' },
  { value: 'essays', label: 'Eseje', group: 'Proza' },
  { value: 'drama', label: 'Dramat', group: 'Proza' },
  { value: 'plays', label: 'Sztuki teatralne', group: 'Proza' },
  { value: 'poetry', label: 'Poezja', group: 'Proza' },
  { value: 'humor', label: 'Humor / satyra', group: 'Proza' },

  // Gatunki fabularne
  { value: 'fantasy', label: 'Fantasy', group: 'Gatunki' },
  { value: 'science fiction', label: 'Science fiction', group: 'Gatunki' },
  { value: 'mystery', label: 'Kryminał / mystery', group: 'Gatunki' },
  { value: 'crime', label: 'Crime', group: 'Gatunki' },
  { value: 'detective', label: 'Detektywistyczna', group: 'Gatunki' },
  { value: 'thriller', label: 'Thriller', group: 'Gatunki' },
  { value: 'suspense', label: 'Suspense', group: 'Gatunki' },
  { value: 'horror', label: 'Horror', group: 'Gatunki' },
  { value: 'romance', label: 'Romans', group: 'Gatunki' },
  { value: 'historical fiction', label: 'Historyczna', group: 'Gatunki' },
  { value: 'adventure', label: 'Przygodowa', group: 'Gatunki' },
  { value: 'war stories', label: 'Wojenna', group: 'Gatunki' },
  { value: 'dystopia', label: 'Dystopia', group: 'Gatunki' },
  { value: 'magical realism', label: 'Realizm magiczny', group: 'Gatunki' },
  { value: 'urban fantasy', label: 'Urban fantasy', group: 'Gatunki' },
  { value: 'paranormal', label: 'Paranormal', group: 'Gatunki' },
  { value: 'western', label: 'Western', group: 'Gatunki' },
  { value: 'spy stories', label: 'Szpiegowska', group: 'Gatunki' },

  // Dla młodszych
  { value: 'young adult', label: 'Young adult', group: 'Dla młodszych' },
  { value: 'juvenile fiction', label: 'Dla dzieci / młodzieży', group: 'Dla młodszych' },
  { value: 'children', label: 'Children', group: 'Dla młodszych' },
  { value: 'picture books', label: 'Obrazkowe', group: 'Dla młodszych' },
  { value: 'comics', label: 'Komiks', group: 'Dla młodszych' },
  { value: 'graphic novels', label: 'Powieść graficzna', group: 'Dla młodszych' },
  { value: 'manga', label: 'Manga', group: 'Dla młodszych' },

  // Non-fiction
  { value: 'biography', label: 'Biografia', group: 'Non-fiction' },
  { value: 'autobiography', label: 'Autobiografia', group: 'Non-fiction' },
  { value: 'memoir', label: 'Memoir / wspomnienia', group: 'Non-fiction' },
  { value: 'history', label: 'Historia', group: 'Non-fiction' },
  { value: 'philosophy', label: 'Filozofia', group: 'Non-fiction' },
  { value: 'psychology', label: 'Psychologia', group: 'Non-fiction' },
  { value: 'religion', label: 'Religia', group: 'Non-fiction' },
  { value: 'science', label: 'Nauka', group: 'Non-fiction' },
  { value: 'politics', label: 'Polityka', group: 'Non-fiction' },
  { value: 'sociology', label: 'Socjologia', group: 'Non-fiction' },
  { value: 'economics', label: 'Ekonomia', group: 'Non-fiction' },
  { value: 'business', label: 'Biznes', group: 'Non-fiction' },
  { value: 'self-help', label: 'Self-help / rozwój', group: 'Non-fiction' },
  { value: 'art', label: 'Sztuka', group: 'Non-fiction' },
  { value: 'music', label: 'Muzyka', group: 'Non-fiction' },
  { value: 'cooking', label: 'Kulinaria', group: 'Non-fiction' },
  { value: 'travel', label: 'Podróże', group: 'Non-fiction' },
  { value: 'nature', label: 'Przyroda', group: 'Non-fiction' },
  { value: 'technology', label: 'Technologia', group: 'Non-fiction' },
  { value: 'medicine', label: 'Medycyna', group: 'Non-fiction' },
  { value: 'education', label: 'Edukacja', group: 'Non-fiction' },
  { value: 'sports', label: 'Sport', group: 'Non-fiction' },
  { value: 'true crime', label: 'True crime', group: 'Non-fiction' },
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
  first_sentence?: string | { value?: string } | string[];
}

export function cleanDescriptionText(raw: unknown): string | undefined {
  if (!raw) return undefined;
  let text = '';
  if (typeof raw === 'string') {
    text = raw;
  } else if (
    typeof raw === 'object' &&
    raw !== null &&
    'value' in raw &&
    typeof (raw as { value: unknown }).value === 'string'
  ) {
    text = (raw as { value: string }).value;
  }
  if (!text) return undefined;

  // Clean markdown source links
  text = text.replace(/\(\[source\]\(.*?\)\)/gi, '');
  text = text.replace(/\[source\]\(.*?\)/gi, '');
  text = text.replace(/\[source:[^\]]+\]/gi, '');
  text = text.replace(/---\s*[\r\n]+See also:[\s\S]*$/i, '');
  text = text.replace(/----------[\s\S]*$/i, '');
  text = text.replace(/Contains:\s*[\r\n]+- [\s\S]*$/i, '');

  text = text.trim();
  return text.length > 0 ? text : undefined;
}

export async function fetchWorkDetails(
  workIdOrKey: string,
): Promise<{ description?: string; firstSentence?: string; excerpts?: string[] }> {
  const cleanId = workIdOrKey.replace('/works/', '').replace('/books/', '');
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${WORKS_BASE}/${cleanId}.json`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return {};
    const data = (await res.json()) as {
      description?: unknown;
      first_sentence?: string | { value?: string };
      excerpts?: Array<string | { excerpt?: string; comment?: string }>;
    };
    const description = cleanDescriptionText(data.description);

    let firstSentence: string | undefined = undefined;
    if (typeof data.first_sentence === 'string') {
      firstSentence = data.first_sentence;
    } else if (
      data.first_sentence &&
      typeof data.first_sentence === 'object' &&
      'value' in data.first_sentence
    ) {
      firstSentence = String(data.first_sentence.value);
    }

    const excerpts: string[] = [];
    if (Array.isArray(data.excerpts)) {
      for (const item of data.excerpts) {
        if (typeof item === 'string') {
          excerpts.push(item);
        } else if (
          item &&
          typeof item === 'object' &&
          'excerpt' in item &&
          typeof item.excerpt === 'string'
        ) {
          excerpts.push(item.excerpt);
          if (
            !firstSentence &&
            (item.comment?.toLowerCase().includes('first') || excerpts.length === 1)
          ) {
            firstSentence = item.excerpt;
          }
        }
      }
    }

    return {
      description,
      firstSentence: firstSentence?.trim() || undefined,
      excerpts: excerpts.length > 0 ? excerpts : undefined,
    };
  } catch {
    return {};
  }
}

export function formatReadingTime(pages?: number | null): {
  formatted: string;
  evenings: string;
  minutes: number;
} {
  const p = pages && pages > 0 ? pages : 280;
  const minutes = Math.round(p * 1.3);
  const hours = Math.floor(minutes / 60);
  const remMins = minutes % 60;
  const evenings = Math.max(1, Math.ceil(minutes / 90));
  const evenWord = evenings === 1 ? 'wieczór' : evenings < 5 ? 'wieczory' : 'wieczorów';

  const formatted =
    hours > 0 ? `~${hours} godz.${remMins > 0 ? ` ${remMins} min` : ''}` : `~${remMins} min`;

  return {
    formatted,
    evenings: `ok. ${evenings} ${evenWord}`,
    minutes,
  };
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

/** Liczba filtrów schowanych w „Więcej”. */
export function countAdvancedBookFilters(filters: BookLotteryFilters): number {
  let n = 0;
  if (filters.minRatingsCount > 0) n += 1;
  if (filters.minEditions > 0) n += 1;
  if (filters.minPages > 0) n += 1;
  if (filters.yearFrom != null || filters.yearTo != null) n += 1;
  return n;
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

  let firstSentence: string | undefined = undefined;
  if (typeof doc.first_sentence === 'string') {
    firstSentence = doc.first_sentence;
  } else if (
    doc.first_sentence &&
    typeof doc.first_sentence === 'object' &&
    'value' in doc.first_sentence
  ) {
    firstSentence = String(doc.first_sentence.value);
  } else if (Array.isArray(doc.first_sentence) && doc.first_sentence.length > 0) {
    firstSentence = String(doc.first_sentence[0]);
  }

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
    firstSentence: firstSentence?.trim() || undefined,
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
  'first_sentence',
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
  const winner = { ...weightedPick(source, filters) };

  // Calculate reading time
  if (winner.pages && winner.pages > 0) {
    winner.readingTimeMinutes = Math.round(winner.pages * 1.3);
  }

  // Fetch full work details for description and first sentence in parallel with reel preparation
  try {
    const details = await fetchWorkDetails(winner.id);
    if (details.description) {
      winner.description = details.description;
    }
    if (details.firstSentence && !winner.firstSentence) {
      winner.firstSentence = details.firstSentence;
    }
    if (details.excerpts?.length) {
      winner.excerpts = details.excerpts;
    }
  } catch {
    // Continue even if work details fetch fails
  }

  const reel = [...pool].sort(
    (a, b) => pickScore(b, filters) - pickScore(a, filters),
  );

  return { winner, reel, numFound };
}

export interface OpenLibraryQuickBook {
  title: string;
  author: string;
  cover?: string;
  pages?: number;
  year?: number;
  subjects?: string[];
  rating?: number;
}

export async function searchOpenLibraryBooksByQuery(
  query: string,
  limit = 8,
): Promise<OpenLibraryQuickBook[]> {
  if (!query.trim()) return [];
  try {
    const params = new URLSearchParams({
      q: query.trim(),
      limit: String(limit),
      fields: 'title,author_name,cover_i,number_of_pages_median,first_publish_year,subject,ratings_average',
    });
    const response = await fetch(`${SEARCH_URL}?${params.toString()}`);
    if (!response.ok) return [];
    const data = (await response.json()) as OpenLibrarySearchResponse;
    return (data.docs ?? []).map((doc) => ({
      title: doc.title || '',
      author: doc.author_name?.[0] || 'Nieznany autor',
      cover: doc.cover_i ? `${COVER_BASE}/${doc.cover_i}-L.jpg` : undefined,
      pages: doc.number_of_pages_median || undefined,
      year: doc.first_publish_year || undefined,
      subjects: doc.subject?.slice(0, 3) || [],
      rating: doc.ratings_average ? Math.min(10, Math.round(doc.ratings_average * 20) / 10) : undefined,
    }));
  } catch {
    return [];
  }
}

