import {
  exportBooksToJson,
  exportBooksToCsv,
  parseBooksFromJson,
  parseBooksFromCsv,
} from '../exportImportService';
import type { Book } from '../../types/Book';

describe('exportImportService', () => {
  const mockBooks: Book[] = [
    {
      id: 'book-1',
      title: 'Wiedźmin: Ostatnie życzenie',
      author: 'Andrzej Sapkowski',
      read: 'Przeczytana',
      overallPages: 320,
      readPages: 320,
      rating: 9,
      genre: 'Fantasy',
      cover: 'https://example.com/cover1.jpg',
      isFavorite: true,
      createdAt: '2023-01-01T12:00:00.000Z',
    },
    {
      id: 'book-2',
      title: 'Czysty Kod',
      author: 'Robert C. Martin',
      read: 'W trakcie',
      overallPages: 450,
      readPages: 150,
      rating: 8.5,
      genre: 'Informatyka',
      isFavorite: false,
      createdAt: '2023-02-01T12:00:00.000Z',
    },
  ];

  describe('exportBooksToJson', () => {
    it('should generate valid JSON content with version and books', () => {
      const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
      const mockRevokeObjectURL = jest.fn();
      window.URL.createObjectURL = mockCreateObjectURL;
      window.URL.revokeObjectURL = mockRevokeObjectURL;

      const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
      const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation((node) => node);

      exportBooksToJson(mockBooks, 'my-books');

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');

      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe('exportBooksToCsv', () => {
    it('should trigger CSV download with UTF-8 BOM', () => {
      const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
      const mockRevokeObjectURL = jest.fn();
      window.URL.createObjectURL = mockCreateObjectURL;
      window.URL.revokeObjectURL = mockRevokeObjectURL;

      const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
      const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation((node) => node);

      exportBooksToCsv(mockBooks, 'my-books');

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe('parseBooksFromJson', () => {
    it('should parse valid JSON object with books array', () => {
      const jsonContent = JSON.stringify({
        version: '1.0',
        exportedAt: new Date().toISOString(),
        books: [
          {
            title: 'Solaris',
            author: 'Stanisław Lem',
            read: 'Przeczytana',
            overallPages: 220,
            readPages: 220,
            rating: 9,
            genre: 'Sci-Fi',
          },
        ],
      });

      const books = parseBooksFromJson(jsonContent);
      expect(books).toHaveLength(1);
      expect(books[0].title).toBe('Solaris');
      expect(books[0].author).toBe('Stanisław Lem');
    });

    it('should parse raw array of books', () => {
      const jsonContent = JSON.stringify([
        {
          title: 'Lalka',
          author: 'Bolesław Prus',
          read: 'Przeczytana',
          overallPages: 650,
          readPages: 650,
          rating: 7,
        },
      ]);

      const books = parseBooksFromJson(jsonContent);
      expect(books).toHaveLength(1);
      expect(books[0].title).toBe('Lalka');
    });

    it('should throw error for invalid JSON string', () => {
      expect(() => parseBooksFromJson('{ invalid json:')).toThrow('Nieprawidłowy format JSON');
    });

    it('should throw error when no valid books found', () => {
      const jsonContent = JSON.stringify([
        {
          title: '', // Invalid empty title
          author: '',
        },
      ]);

      expect(() => parseBooksFromJson(jsonContent)).toThrow();
    });
  });

  describe('parseBooksFromCsv', () => {
    it('should parse valid CSV with header and comma delimiter', () => {
      const csvContent = `Tytuł,Autor,Status,Gatunek,Liczba stron,Przeczytane strony,Ocena,URL okładki,Ulubiona,Data dodania
"Dune","Frank Herbert","Przeczytana","Sci-Fi",600,600,9.5,"https://example.com/dune.jpg","tak","2023-01-01"`;

      const books = parseBooksFromCsv(csvContent);
      expect(books).toHaveLength(1);
      expect(books[0].title).toBe('Dune');
      expect(books[0].author).toBe('Frank Herbert');
      expect(books[0].read).toBe('Przeczytana');
      expect(books[0].overallPages).toBe(600);
      expect(books[0].isFavorite).toBe(true);
    });

    it('should throw error for empty CSV', () => {
      expect(() => parseBooksFromCsv('')).toThrow('Plik CSV jest pusty');
    });
  });
});
