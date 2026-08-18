import {
  posterUrl,
  backdropUrl,
  providerLogoUrl,
  releaseYear,
  countAdvancedFilters,
} from '../tmdbService';
import { DEFAULT_FILTERS } from '../../constants/movieFilters';

describe('tmdbService', () => {
  describe('posterUrl', () => {
    it('should return null when path is null or empty', () => {
      expect(posterUrl(null)).toBeNull();
      expect(posterUrl('')).toBeNull();
    });

    it('should build poster URL with default w500 size', () => {
      expect(posterUrl('/test.jpg')).toBe('https://image.tmdb.org/t/p/w500/test.jpg');
    });

    it('should build poster URL with custom size', () => {
      expect(posterUrl('/test.jpg', 'w780')).toBe('https://image.tmdb.org/t/p/w780/test.jpg');
    });
  });

  describe('backdropUrl', () => {
    it('should return null when path is null or empty', () => {
      expect(backdropUrl(null)).toBeNull();
      expect(backdropUrl('')).toBeNull();
    });

    it('should build backdrop URL with w1280 size', () => {
      expect(backdropUrl('/bg.jpg')).toBe('https://image.tmdb.org/t/p/w1280/bg.jpg');
    });
  });

  describe('providerLogoUrl', () => {
    it('should return null when path is null', () => {
      expect(providerLogoUrl(null)).toBeNull();
    });

    it('should build provider logo URL with w92 size', () => {
      expect(providerLogoUrl('/logo.jpg')).toBe('https://image.tmdb.org/t/p/w92/logo.jpg');
    });
  });

  describe('releaseYear', () => {
    it('should extract 4 digit year from ISO date', () => {
      expect(releaseYear('2023-05-12')).toBe('2023');
      expect(releaseYear('1999')).toBe('1999');
    });

    it('should return dash for undefined or short strings', () => {
      expect(releaseYear(undefined)).toBe('—');
      expect(releaseYear('')).toBe('—');
      expect(releaseYear('99')).toBe('—');
    });
  });

  describe('countAdvancedFilters', () => {
    it('should return 0 for default filters', () => {
      expect(countAdvancedFilters(DEFAULT_FILTERS)).toBe(0);
    });

    it('should accurately count active advanced filters', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        maxRating: 8.5,
        originalLanguage: 'pl',
        sortBy: 'vote_average.desc' as const,
      };

      expect(countAdvancedFilters(filters)).toBe(3);
    });
  });
});
