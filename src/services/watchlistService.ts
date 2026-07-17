import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { ERROR_MESSAGES } from '../constants/validation';
import type { Movie } from '../types/Movie';
import type { WatchlistMovie, WatchlistMovieInput } from '../types/WatchlistMovie';

const COLLECTION = 'watchlist';

function toError(error: unknown, fallback: string): Error {
  if (error instanceof Error) return error;
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return new Error((error as { message: string }).message);
  }
  return new Error(fallback);
}

function mapDoc(id: string, data: Record<string, unknown>): WatchlistMovie {
  return {
    id,
    userId: String(data.userId ?? ''),
    tmdbId: Number(data.tmdbId ?? 0),
    title: String(data.title ?? ''),
    originalTitle: String(data.originalTitle ?? ''),
    posterPath: (data.posterPath as string | null) ?? null,
    releaseDate: String(data.releaseDate ?? ''),
    voteAverage: Number(data.voteAverage ?? 0),
    overview: String(data.overview ?? ''),
    genreIds: Array.isArray(data.genreIds) ? data.genreIds.map(Number) : [],
    watched: Boolean(data.watched),
    createdAt: String(data.createdAt ?? ''),
    watchedAt: (data.watchedAt as string | null) ?? null,
  };
}

export async function getUserWatchlist(userId: string): Promise<WatchlistMovie[]> {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const q = query(collection(db, COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));

    return items.sort((a, b) => {
      if (a.watched !== b.watched) return a.watched ? 1 : -1;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  } catch (error) {
    throw toError(error, ERROR_MESSAGES.FIREBASE_ERROR);
  }
}

export function movieToWatchlistInput(movie: Movie, userId: string): WatchlistMovieInput {
  return {
    userId,
    tmdbId: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    posterPath: movie.poster_path,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    overview: movie.overview,
    genreIds: movie.genre_ids,
  };
}

export async function addToWatchlist(input: WatchlistMovieInput): Promise<string> {
  try {
    if (!input.userId) {
      throw new Error('User ID is required');
    }

    const existing = await getUserWatchlist(input.userId);
    if (existing.some((item) => item.tmdbId === input.tmdbId)) {
      throw new Error('Ten film jest już na watchliście.');
    }

    const payload = {
      ...input,
      watched: false,
      watchedAt: null,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, COLLECTION), payload);
    return docRef.id;
  } catch (error) {
    throw toError(error, ERROR_MESSAGES.FIREBASE_ERROR);
  }
}

export async function setWatchlistWatched(
  entryId: string,
  watched: boolean,
): Promise<void> {
  try {
    if (!entryId) {
      throw new Error('Entry ID is required');
    }

    await updateDoc(doc(db, COLLECTION, entryId), {
      watched,
      watchedAt: watched ? new Date().toISOString() : null,
    });
  } catch (error) {
    throw toError(error, ERROR_MESSAGES.FIREBASE_ERROR);
  }
}

export async function removeFromWatchlist(entryId: string): Promise<void> {
  try {
    if (!entryId) {
      throw new Error('Entry ID is required');
    }

    await deleteDoc(doc(db, COLLECTION, entryId));
  } catch (error) {
    throw toError(error, ERROR_MESSAGES.FIREBASE_ERROR);
  }
}
