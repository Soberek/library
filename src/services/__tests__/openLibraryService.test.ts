import {
  searchLotteryBooks,
  pickRandomLotteryBook,
  searchOpenLibraryBooksByQuery,
  BOOK_LOTTERY_SUBJECTS,
  BOOK_MOOD_PRESETS,
  cleanDescriptionText,
  formatReadingTime,
} from '../openLibraryService';
import type { BookLotteryFilters } from '../../types/LotteryBook';

describe('openLibraryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultFilters: BookLotteryFilters = {
    subject: 'fantasy',
    language: 'pl',
    requireCover: false,
    minRating: 0,
    minRatingsCount: 0,
    minPopularity: 0,
    minEditions: 0,
    minPages: 0,
    yearFrom: null,
    yearTo: null,
  };

  describe('BOOK_MOOD_PRESETS', () => {
    it('should define curated literary mood presets', () => {
      expect(BOOK_MOOD_PRESETS.length).toBeGreaterThanOrEqual(5);
      const ids = BOOK_MOOD_PRESETS.map((p) => p.id);
      expect(ids).toContain('cozy');
      expect(ids).toContain('noir');
      expect(ids).toContain('fantasy');
      expect(ids).toContain('classics');
    });
  });

  describe('cleanDescriptionText', () => {
    it('should extract string from text object and strip markdown source links', () => {
      const raw = {
        type: '/type/text',
        value: 'Wspaniała powieść fantasy. ([source](https://example.com/source))\r\n---\nSee also:\r\nOther books',
      };
      const cleaned = cleanDescriptionText(raw);
      expect(cleaned).toBe('Wspaniała powieść fantasy.');
    });

    it('should return undefined for empty or invalid input', () => {
      expect(cleanDescriptionText('')).toBeUndefined();
      expect(cleanDescriptionText(null)).toBeUndefined();
      expect(cleanDescriptionText(undefined)).toBeUndefined();
    });
  });

  describe('formatReadingTime', () => {
    it('should calculate reading time in hours, minutes, and evenings', () => {
      const result = formatReadingTime(300);
      expect(result.minutes).toBe(390); // 300 * 1.3
      expect(result.formatted).toContain('6 godz.');
      expect(result.evenings).toContain('wieczor');
    });

    it('should handle zero or undefined pages with defaults', () => {
      const result = formatReadingTime(undefined);
      expect(result.formatted).toBeDefined();
      expect(result.minutes).toBeGreaterThan(0);
    });
  });

  describe('BOOK_LOTTERY_SUBJECTS', () => {
    it('should contain default subjects list', () => {
      expect(BOOK_LOTTERY_SUBJECTS.length).toBeGreaterThan(10);
      expect(BOOK_LOTTERY_SUBJECTS[0]).toEqual({ value: '', label: 'Wszystkie' });
    });
  });

  describe('searchLotteryBooks', () => {
    it('should fetch and map open library books properly', async () => {
      const mockResponse = {
        numFound: 100,
        docs: [
          {
            key: '/works/OL123W',
            title: 'Test Book',
            author_name: ['Test Author'],
            first_publish_year: 2020,
            number_of_pages_median: 300,
            ratings_average: 4.5,
            cover_i: 12345,
            subject: ['Fantasy', 'Magic'],
          },
        ],
      };

      window.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as never);

      const result = await searchLotteryBooks(defaultFilters, 10, 'random');

      expect(result.numFound).toBe(100);
      expect(result.books).toHaveLength(1);
      expect(result.books[0].title).toBe('Test Book');
      expect(result.books[0].authors).toEqual(['Test Author']);
      expect(result.books[0].cover).toContain('12345-L.jpg');
      expect(result.books[0].pages).toBe(300);
    });

    it('should throw an error when API response is not ok', async () => {
      window.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      } as never);

      await expect(searchLotteryBooks(defaultFilters, 10, 'random')).rejects.toThrow('Open Library zwróciło błąd');
    });
  });

  describe('searchOpenLibraryBooksByQuery', () => {
    it('should return empty list for empty query', async () => {
      const result = await searchOpenLibraryBooksByQuery('');
      expect(result).toEqual([]);
    });

    it('should query API and map fields', async () => {
      const mockResponse = {
        docs: [
          {
            key: '/works/OL456W',
            title: 'Solaris',
            author_name: ['Stanisław Lem'],
            number_of_pages_median: 210,
            ratings_average: 4.8,
            cover_i: 999,
            subject: ['Science Fiction'],
          },
        ],
      };

      window.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as never);

      const result = await searchOpenLibraryBooksByQuery('Solaris', 5);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Solaris');
      expect(result[0].author).toBe('Stanisław Lem');
      expect(result[0].pages).toBe(210);
      expect(result[0].rating).toBeCloseTo(9.6);
      expect(result[0].cover).toContain('999-L.jpg');
    });
  });

  describe('pickRandomLotteryBook', () => {
    it('should pick a winner from query results', async () => {
      const mockResponse = {
        numFound: 50,
        docs: [
          {
            key: '/works/OL111W',
            title: 'Book A',
            author_name: ['Author A'],
            first_publish_year: 2015,
          },
          {
            key: '/works/OL222W',
            title: 'Book B',
            author_name: ['Author B'],
            first_publish_year: 2018,
          },
        ],
      };

      window.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as never);

      const result = await pickRandomLotteryBook(defaultFilters);
      expect(result.winner).toBeDefined();
      expect(['Book A', 'Book B']).toContain(result.winner.title);
      expect(result.numFound).toBe(50);
    });
  });
});
