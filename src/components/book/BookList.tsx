import React from 'react';
import { BookCard } from './';
import type { Book, BookStatus } from '../../types/Book';

interface BookListProps {
  books: Book[];
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onShare?: (book: Book) => void;
  onToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
}

const BookList: React.FC<BookListProps> = ({
  books,
  onEdit,
  onDelete,
  onStatusChange,
  onShare,
  onToggleFavorite,
}) => {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes golden-pulse {
          0% { box-shadow: 0 0 15px 0 rgba(251, 191, 36, 0.4), 0 0 30px 0 rgba(245, 158, 11, 0.1); }
          50% { box-shadow: 0 0 25px 8px rgba(251, 191, 36, 0.6), 0 0 40px 10px rgba(245, 158, 11, 0.3); }
          100% { box-shadow: 0 0 15px 0 rgba(251, 191, 36, 0.4), 0 0 30px 0 rgba(245, 158, 11, 0.1); }
        }
        .animate-golden-pulse {
          animation: golden-pulse 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -100% 0; opacity: 0.8; }
          50% { opacity: 1; }
          100% { background-position: 200% 0; opacity: 0.8; }
        }
        .animate-shimmer {
          background-size: 200% 100%;
          background-image: linear-gradient(to right, #f59e0b, #fcd34d, #fbbf24, #f59e0b);
          animation: shimmer 3s infinite linear;
          height: 3px !important;
        }
        
        @keyframes golden-badge {
          0% { box-shadow: 0 0 10px 0 rgba(251, 191, 36, 0.6); transform: scale(1); }
          50% { box-shadow: 0 0 20px 8px rgba(251, 191, 36, 0.9), 0 0 30px 15px rgba(245, 158, 11, 0.3); transform: scale(1.05); }
          100% { box-shadow: 0 0 10px 0 rgba(251, 191, 36, 0.6); transform: scale(1); }
        }
        .animate-golden-badge {
          animation: golden-badge 2s ease-in-out infinite;
          background-image: linear-gradient(135deg, #f59e0b, #fcd34d, #fbbf24, #d97706);
          background-size: 400% 100%;
          animation: shimmer-background 4s linear infinite;
        }
        
        @keyframes shimmer-background {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        @keyframes star-spin {
          0% { transform: rotate(0deg) scale(1); filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.6)); }
          25% { transform: rotate(15deg) scale(1.2); filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.9)); }
          50% { transform: rotate(0deg) scale(1); filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.6)); }
          75% { transform: rotate(-15deg) scale(1.2); filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.9)); }
          100% { transform: rotate(0deg) scale(1); filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.6)); }
        }
        .animate-star-spin {
          animation: star-spin 2.5s ease-in-out infinite;
        }
      `}</style>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onShare={onShare}
            onToggleFavorite={(bookId, currentFavorite) => {
              onToggleFavorite(bookId, currentFavorite);
            }}
          />
        ))}
      </div>
    </>
  );
};

export default BookList;
