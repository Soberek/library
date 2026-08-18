import {
  searchLotteryBooks,
  pickRandomLotteryBook,
  searchOpenLibraryBooksByQuery,
  BOOK_LOTTERY_SUBJECTS,
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
