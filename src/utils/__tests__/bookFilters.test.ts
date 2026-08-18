import {
  filterByStatus,
  filterByGenre,
  filterByRating,
  filterByPages,
  filterByFavorites,
  filterByAuthor,
  filterBySearchTerm,
  sortBooks,
  applyFiltersAndSort,
} from '../bookFilters';
import type { Book } from '../../types/Book';
import type { FilterState } from '../../stores/filterStore';

describe('bookFilters', () => {
  const books: Book[] = [
    {
      id: '1',
      title: 'Solaris',
      author: 'Stanisław Lem',
      read: 'Przeczytana',
      overallPages: 220,
      readPages: 220,
      rating: 9.5,
      genre: 'Sci-Fi',
      isFavorite: true,
      createdAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'Lalka',
      author: 'Bolesław Prus',
      read: 'W trakcie',
      overallPages: 650,
      readPages: 200,
      rating: 8,
      genre: 'Klasyka',
      isFavorite: false,
      createdAt: '2023-02-01T00:00:00.000Z',
    },
    {
      id: '3',
      title: 'Wiedźmin',
      author: 'Andrzej Sapkowski',
      read: 'Chcę przeczytać',
      overallPages: 350,
      readPages: 0,
      rating: 9,
      genre: 'Fantasy',
      isFavorite: true,
      createdAt: '2023-03-01T00:00:00.000Z',
    },
  ];

  describe('filterByStatus', () => {
    it('should return all books if status is "all"', () => {
      expect(filterByStatus(books, 'all')).toHaveLength(3);
    });

    it('should filter by specific status', () => {
      const readBooks = filterByStatus(books, 'Przeczytana');
      expect(readBooks).toHaveLength(1);
      expect(readBooks[0].title).toBe('Solaris');
    });
  });

  describe('filterByGenre', () => {
    it('should filter by genre or return all when genre is all', () => {
      expect(filterByGenre(books, 'all')).toHaveLength(3);
      const scifi = filterByGenre(books, 'Sci-Fi');
      expect(scifi).toHaveLength(1);
      expect(scifi[0].title).toBe('Solaris');
    });
  });

  describe('filterByRating', () => {
    it('should filter within rating range', () => {
      const result = filterByRating(books, [9, 10]);
      expect(result).toHaveLength(2);
      expect(result.map((b) => b.title)).toEqual(['Solaris', 'Wiedźmin']);
    });
  });

  describe('filterByPages', () => {
    it('should filter within pages range', () => {
      const result = filterByPages(books, [300, 700]);
      expect(result).toHaveLength(2);
      expect(result.map((b) => b.title)).toEqual(['Lalka', 'Wiedźmin']);
    });
  });

  describe('filterByFavorites', () => {
    it('should filter only favorites when flag is true', () => {
      expect(filterByFavorites(books, true)).toHaveLength(2);
      expect(filterByFavorites(books, false)).toHaveLength(3);
    });
  });

  describe('filterByAuthor', () => {
    it('should search author case-insensitively', () => {
      const result = filterByAuthor(books, 'lem');
      expect(result).toHaveLength(1);
      expect(result[0].author).toBe('Stanisław Lem');
    });
  });

  describe('filterBySearchTerm', () => {
    it('should search in both title and author', () => {
      expect(filterBySearchTerm(books, 'prus')).toHaveLength(1);
      expect(filterBySearchTerm(books, 'wiedźmin')).toHaveLength(1);
      expect(filterBySearchTerm(books, 'nonexistent')).toHaveLength(0);
    });
  });

  describe('sortBooks', () => {
    it('should sort by title ascending and descending', () => {
      const asc = sortBooks(books, 'title', 'asc');
      expect(asc[0].title).toBe('Lalka');

      const desc = sortBooks(books, 'title', 'desc');
      expect(desc[0].title).toBe('Wiedźmin');
    });

    it('should sort by rating', () => {
      const desc = sortBooks(books, 'rating', 'desc');
      expect(desc[0].title).toBe('Solaris');
    });

    it('should sort by pages', () => {
      const desc = sortBooks(books, 'pages', 'desc');
      expect(desc[0].title).toBe('Lalka');
    });
  });

  describe('applyFiltersAndSort', () => {
    it('should apply composite filter and sorting correctly', () => {
      const filters: FilterState = {
        status: 'all',
        genre: 'all',
        ratingRange: [0, 10],
        pagesRange: [0, 1000],
        showOnlyFavorites: true,
        author: '',
        searchTerm: 'sapkowski',
        sortBy: 'title',
        sortOrder: 'asc',
        statsYear: 'all',
      };


      const result = applyFiltersAndSort(books, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Wiedźmin');
    });
  });
});
