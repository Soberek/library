import type { MovieSortBy } from '../types/Movie';

export const MOVIE_SORT_OPTIONS: { value: MovieSortBy; label: string }[] = [
  { value: 'popularity.desc', label: 'Popularność ↓' },
  { value: 'popularity.asc', label: 'Popularność ↑' },
  { value: 'vote_average.desc', label: 'Ocena ↓' },
  { value: 'vote_average.asc', label: 'Ocena ↑' },
  { value: 'primary_release_date.desc', label: 'Najnowsze' },
  { value: 'primary_release_date.asc', label: 'Najstarsze' },
  { value: 'vote_count.desc', label: 'Najwięcej głosów' },
];

export const ORIGINAL_LANGUAGES: { code: string; label: string }[] = [
  { code: 'pl', label: 'Polski' },
  { code: 'en', label: 'Angielski' },
  { code: 'fr', label: 'Francuski' },
  { code: 'de', label: 'Niemiecki' },
  { code: 'es', label: 'Hiszpański' },
  { code: 'it', label: 'Włoski' },
  { code: 'ja', label: 'Japoński' },
  { code: 'ko', label: 'Koreański' },
  { code: 'zh', label: 'Chiński' },
  { code: 'sv', label: 'Szwedzki' },
  { code: 'no', label: 'Norweski' },
  { code: 'da', label: 'Duński' },
  { code: 'cs', label: 'Czeski' },
  { code: 'hu', label: 'Węgierski' },
  { code: 'pt', label: 'Portugalski' },
  { code: 'ru', label: 'Rosyjski' },
  { code: 'hi', label: 'Hindi' },
  { code: 'tr', label: 'Turecki' },
];

export const ORIGIN_COUNTRIES: { code: string; label: string }[] = [
  { code: 'PL', label: 'Polska' },
  { code: 'US', label: 'USA' },
  { code: 'GB', label: 'Wielka Brytania' },
  { code: 'FR', label: 'Francja' },
  { code: 'DE', label: 'Niemcy' },
  { code: 'IT', label: 'Włochy' },
  { code: 'ES', label: 'Hiszpania' },
  { code: 'JP', label: 'Japonia' },
  { code: 'KR', label: 'Korea Płd.' },
  { code: 'SE', label: 'Szwecja' },
  { code: 'NO', label: 'Norwegia' },
  { code: 'DK', label: 'Dania' },
  { code: 'CA', label: 'Kanada' },
  { code: 'AU', label: 'Australia' },
  { code: 'IN', label: 'Indie' },
  { code: 'CN', label: 'Chiny' },
];

export const WATCH_REGIONS: { code: string; label: string }[] = [
  { code: 'PL', label: 'Polska' },
  { code: 'US', label: 'USA' },
  { code: 'GB', label: 'Wielka Brytania' },
  { code: 'DE', label: 'Niemcy' },
  { code: 'FR', label: 'Francja' },
];

/** Common US MPAA + PL-friendly labels mapped to US cert for TMDB */
export const CERTIFICATIONS: { value: string; label: string }[] = [
  { value: 'G', label: 'G — dla wszystkich' },
  { value: 'PG', label: 'PG — z rodzicem' },
  { value: 'PG-13', label: 'PG-13 — 13+' },
  { value: 'R', label: 'R — 17+' },
  { value: 'NC-17', label: 'NC-17 — tylko dorośli' },
];

export const RUNTIME_PRESETS: { min: number | null; max: number | null; label: string }[] = [
  { min: null, max: null, label: 'Dowolny' },
  { min: null, max: 90, label: '≤ 90 min' },
  { min: 90, max: 120, label: '90–120' },
  { min: 120, max: 150, label: '120–150' },
  { min: 150, max: null, label: '150+ min' },
];
