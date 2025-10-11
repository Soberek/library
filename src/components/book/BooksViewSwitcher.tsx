import React from 'react';
import { BookGridView } from './GridView';
import { BookTableView } from './TableView';
import type { Book, BookStatus } from '../../types/Book';

interface BooksViewSwitcherProps {
  books: Book[];
  viewMode: 'cards' | 'table';
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  onShare?: (book: Book) => void;
  onRatingChange?: (bookId: string, newRating: number) => void;
  // Pagination props
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
}

/**
 * Switches between grid and table views for books
 * Handles the conditional rendering and prop forwarding
 */
export const BooksViewSwitcher: React.FC<BooksViewSwitcherProps> = ({
  books,
  viewMode,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleFavorite,
  onShare,
  onRatingChange,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}) => {
  if (viewMode === 'table') {
    return (
      <BookTableView
        books={books}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onToggleFavorite={onToggleFavorite}
        onRatingChange={onRatingChange}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    );
  }

  return (
    <BookGridView
      books={books}
      onEdit={onEdit}
      onDelete={onDelete}
      onStatusChange={onStatusChange}
      onToggleFavorite={onToggleFavorite}
      onShare={onShare}
      onRatingChange={onRatingChange}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      enableInfiniteScroll={false}
    />
  );
};

export default BooksViewSwitcher;
