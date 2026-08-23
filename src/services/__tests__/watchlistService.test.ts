import {
  getUserWatchlist,
  movieToWatchlistInput,
  addToWatchlist,
  setWatchlistWatched,
  removeFromWatchlist,
} from '../watchlistService';
import { collection, query, where, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import type { Movie } from '../../types/Movie';

jest.mock('firebase/firestore');
jest.mock('../../config/firebaseConfig', () => ({
  db: {},
}));

const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockQuery = query as jest.MockedFunction<typeof query>;
const mockWhere = where as jest.MockedFunction<typeof where>;
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;

describe('watchlistService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMovie: Movie = {
    id: 550,
    title: 'Fight Club',
    original_title: 'Fight Club',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    release_date: '1999-10-15',
    vote_average: 8.4,
    vote_count: 24000,
    overview: 'An ticking-time-bomb insomniac...',
    genre_ids: [18, 53],
    adult: false,
    popularity: 45.8,
  };

  describe('movieToWatchlistInput', () => {
    it('should correctly format movie into watchlist movie input', () => {
      const result = movieToWatchlistInput(mockMovie, 'user-123');

      expect(result).toEqual({
        userId: 'user-123',
        tmdbId: 550,
        title: 'Fight Club',
        originalTitle: 'Fight Club',
        posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        releaseDate: '1999-10-15',
        voteAverage: 8.4,
        overview: 'An ticking-time-bomb insomniac...',
        genreIds: [18, 53],
      });
    });
  });

  describe('getUserWatchlist', () => {
    it('should fetch and map user watchlist items', async () => {
      const mockSnapshot = {
        docs: [
          {
            id: 'doc-1',
            data: () => ({
              userId: 'user-123',
              tmdbId: 550,
              title: 'Fight Club',
              watched: false,
              createdAt: '2023-01-01T00:00:00.000Z',
            }),
          },
        ],
      };

      mockCollection.mockReturnValue({} as never);
      mockQuery.mockReturnValue({} as never);
      mockWhere.mockReturnValue({} as never);
      mockGetDocs.mockResolvedValue(mockSnapshot as never);

      const list = await getUserWatchlist('user-123');

      expect(list).toHaveLength(1);
      expect(list[0].id).toBe('doc-1');
      expect(list[0].title).toBe('Fight Club');
    });

    it('should throw error when userId is missing', async () => {
      await expect(getUserWatchlist('')).rejects.toThrow('User ID is required');
    });
  });

  describe('addToWatchlist', () => {
    it('should add item when not already present in watchlist', async () => {
      mockCollection.mockReturnValue({} as never);
      mockQuery.mockReturnValue({} as never);
      mockWhere.mockReturnValue({} as never);
      mockGetDocs.mockResolvedValue({ docs: [] } as never);
      mockAddDoc.mockResolvedValue({ id: 'new-watch-id' } as never);

      const input = movieToWatchlistInput(mockMovie, 'user-123');
      const id = await addToWatchlist(input);

      expect(id).toBe('new-watch-id');
      expect(mockAddDoc).toHaveBeenCalledWith({}, expect.objectContaining({
        userId: 'user-123',
        tmdbId: 550,
        watched: false,
      }));
    });

    it('should return existing ID if movie already in watchlist without duplicate', async () => {
      mockCollection.mockReturnValue({} as never);
      mockQuery.mockReturnValue({} as never);
      mockWhere.mockReturnValue({} as never);
      mockGetDocs.mockResolvedValue({
        docs: [{ id: 'existing', data: () => ({ tmdbId: 550, userId: 'user-123', watched: false }) }],
      } as never);

      const input = movieToWatchlistInput(mockMovie, 'user-123');
      const id = await addToWatchlist(input);
      expect(id).toBe('existing');
      expect(mockAddDoc).not.toHaveBeenCalled();
    });
  });

  describe('setWatchlistWatched', () => {
    it('should update watched state', async () => {
      mockDoc.mockReturnValue({} as never);
      mockUpdateDoc.mockResolvedValue(undefined);

      await setWatchlistWatched('doc-1', true);

      expect(mockDoc).toHaveBeenCalledWith(db, 'watchlist', 'doc-1');
      expect(mockUpdateDoc).toHaveBeenCalledWith({}, expect.objectContaining({ watched: true }));
    });
  });

  describe('removeFromWatchlist', () => {
    it('should delete document', async () => {
      mockDoc.mockReturnValue({} as never);
      mockDeleteDoc.mockResolvedValue(undefined);

      await removeFromWatchlist('doc-1');

      expect(mockDoc).toHaveBeenCalledWith(db, 'watchlist', 'doc-1');
      expect(mockDeleteDoc).toHaveBeenCalledWith({});
    });
  });
});
