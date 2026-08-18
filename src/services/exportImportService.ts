import type { Book, BookStatus } from '../types/Book';
import { bookSchema } from '../schemas/bookSchema';

export interface ExportImportStats {
  imported: number;
  skipped: number;
  errors: string[];
}

/**
 * Generates formatted ISO-like date string for filename (YYYY-MM-DD)
 */
function getDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Triggers a client-side file download
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Exports all books to formatted JSON file
 */
export function exportBooksToJson(books: Book[], filename?: string): void {
  const exportData = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    app: 'MyLibrary',
    count: books.length,
    books: books.map(({ id, ...rest }) => rest),
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const fname = filename || `mylibrary-books-${getDateString()}.json`;
  downloadFile(jsonString, fname, 'application/json;charset=utf-8');
}

/**
 * Escapes a field for CSV according to RFC 4180
 */
function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) return '""';
  const str = String(field);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Exports all books to a clean CSV file with UTF-8 BOM
 */
export function exportBooksToCsv(books: Book[], filename?: string): void {
  const headers = [
    'Tytuł',
    'Autor',
    'Status',
    'Gatunek',
    'Liczba stron',
    'Przeczytane strony',
    'Ocena',
    'URL okładki',
    'Ulubiona',
    'Data dodania',
  ];

  const rows = books.map((book) => [
    escapeCsvField(book.title),
    escapeCsvField(book.author),
    escapeCsvField(book.read),
    escapeCsvField(book.genre),
    escapeCsvField(book.overallPages),
    escapeCsvField(book.readPages ?? 0),
    escapeCsvField(book.rating),
    escapeCsvField(book.cover ?? ''),
    escapeCsvField(book.isFavorite ? 'Tak' : 'Nie'),
    escapeCsvField(book.createdAt ?? ''),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const fname = filename || `mylibrary-books-${getDateString()}.csv`;
  downloadFile(csvContent, fname, 'text/csv;charset=utf-8');
}

/**
 * Parses and validates book items from a JSON string
 */
export function parseBooksFromJson(jsonString: string): Omit<Book, 'id'>[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new Error('Nieprawidłowy format JSON: ' + (err instanceof Error ? err.message : 'błąd parsowania'));
  }

  let items: unknown[] = [];
  if (Array.isArray(parsed)) {
    items = parsed;
  } else if (typeof parsed === 'object' && parsed !== null && 'books' in parsed && Array.isArray((parsed as { books: unknown[] }).books)) {
    items = (parsed as { books: unknown[] }).books;
  } else {
    throw new Error('Plik JSON nie zawiera prawidłowej tablicy książek.');
  }

  const validBooks: Omit<Book, 'id'>[] = [];

  for (let i = 0; i < items.length; i++) {
    const raw = items[i];
    if (typeof raw !== 'object' || raw === null) continue;

    const candidate = {
      ...(raw as Record<string, unknown>),
      id: 'temp-id', // Schema requires an id to validate
      overallPages: Number((raw as Record<string, unknown>).overallPages || 1),
      readPages: Number((raw as Record<string, unknown>).readPages || 0),
      rating: Number((raw as Record<string, unknown>).rating || 0),
      isFavorite: Boolean((raw as Record<string, unknown>).isFavorite),
      read: ((raw as Record<string, unknown>).read as BookStatus) || 'W trakcie',
      genre: String((raw as Record<string, unknown>).genre || 'Inne'),
      title: String((raw as Record<string, unknown>).title || ''),
      author: String((raw as Record<string, unknown>).author || ''),
      cover: String((raw as Record<string, unknown>).cover || ''),
    };

    const parseResult = bookSchema.safeParse(candidate);
    if (parseResult.success) {
      const { id: _, ...validBook } = parseResult.data;
      validBooks.push(validBook);
    }
  }

  if (validBooks.length === 0 && items.length > 0) {
    throw new Error('Żadna z pozycji w pliku JSON nie spełnia wymogów walidacji.');
  }

  return validBooks;
}

/**
 * Splits a CSV line taking into account quoted fields containing commas and quotes
 */
function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Parses and validates book items from a CSV string
 */
export function parseBooksFromCsv(csvString: string): Omit<Book, 'id'>[] {
  const cleanStr = csvString.replace(/^\uFEFF/, '').trim();
  const lines = cleanStr.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length <= 1) {
    throw new Error('Plik CSV jest pusty lub zawiera tylko nagłówek.');
  }

  const validBooks: Omit<Book, 'id'>[] = [];

  // Skip header (line 0)
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length < 2) continue;

    const title = cols[0] || '';
    const author = cols[1] || '';
    const read = (cols[2] as BookStatus) || 'W trakcie';
    const genre = cols[3] || 'Inne';
    const overallPages = parseInt(cols[4], 10) || 1;
    const readPages = parseInt(cols[5], 10) || 0;
    const rating = parseFloat(cols[6]) || 0;
    const cover = cols[7] || '';
    const isFavorite = ['tak', 'true', '1', 'yes'].includes((cols[8] || '').toLowerCase());
    const createdAt = cols[9] || new Date().toISOString();

    const candidate = {
      id: 'temp-id',
      title,
      author,
      read: ['W trakcie', 'Przeczytana', 'Porzucona', 'Chcę przeczytać'].includes(read) ? read : 'W trakcie',
      genre,
      overallPages: Math.max(1, Math.min(overallPages, 5000)),
      readPages: Math.max(0, Math.min(readPages, overallPages)),
      rating: Math.max(0, Math.min(rating, 10)),
      cover: cover && /^https?:\/\//i.test(cover) ? cover : undefined,
      isFavorite,
      createdAt,
    };

    const parseResult = bookSchema.safeParse(candidate);
    if (parseResult.success) {
      const { id: _, ...validBook } = parseResult.data;
      validBooks.push(validBook);
    }
  }

  if (validBooks.length === 0) {
    throw new Error('Nie udało się zaimportować żadnej książki z pliku CSV. Sprawdź format pliku.');
  }

  return validBooks;
}
