import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import type { Book, BookStatus } from '../../types/Book';
import { BOOK_STATUSES } from '../../constants/bookStatus';
import BookCard from './BookCard';
import BookTable from './BookTable'; // Add import

interface BookListProps {
  loading: boolean;
  books: Book[];
  handleStatusChange: (bookId: string, newStatus: BookStatus) => void;
  handleBookUpdate: (bookId: string, updatedBook: Partial<Book>) => void;
  handleBookDelete: (bookId: string) => void;
  handleBookModalOpen: (params: { mode: 'add' | 'edit'; bookId: string | null }) => void;
  handleToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  viewMode: 'cards' | 'table';
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export default function BookList({
  loading,
  books,
  handleStatusChange,
  handleBookUpdate,
  handleBookDelete,
  handleBookModalOpen,
  handleToggleFavorite,
  viewMode,
  sortField,
  sortOrder,
  onSortChange
}: BookListProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = (book: Book) => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Sprawdź tę książkę: ${book.title} by ${book.author}`,
      }).catch(() => {});
    }
  };

  const handleDelete = (bookId: string) => {
    handleBookDelete(bookId);
    setOpenMenu(null);
  };

  const handleRatingChange = (bookId: string, newRating: number) => {
    handleBookUpdate(bookId, { rating: newRating });
  };

  const handleEdit = (bookId: string) => {
    handleBookModalOpen({ mode: 'edit', bookId });
    setOpenMenu(null);
  };

  const handleMenuToggle = (bookId: string) => {
    setOpenMenu(bookId || null);
  };



  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center py-16">
        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
          <div className="relative">
            <div className="w-18 h-18 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600 opacity-60" />
          </div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Ładowanie książek...
          </h3>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center py-16">
        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
          <div className="relative w-36 h-36 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] bg-gradient-to-br from-indigo-500 to-purple-600 opacity-12 flex items-center justify-center animate-float">
            <div className="absolute inset-[-8px] rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50 blur-xl -z-10" />
            <BookOpen className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Brak książek w bibliotece
          </h2>
          <p className="text-lg text-slate-600 text-center max-w-md leading-relaxed">
            Dodaj swoją pierwszą książkę, aby rozpocząć śledzenie swoich lektur i budować cyfrową bibliotekę
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === 'table') {
    return (
      <BookTable
        books={books}
        handleStatusChange={handleStatusChange}
        handleRatingChange={handleRatingChange}
        handleToggleFavorite={handleToggleFavorite}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleShare={handleShare}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 p-4 mb-16">
      {books.map((book, index) => {
        const isHovered = hoveredCard === book.id;
        const isFavorite = book.isFavorite ?? false;

        return (
          <BookCard
            key={book.id}
            book={book}
            index={index}
            mounted={mounted}
            isHovered={isHovered}
            isFavorite={isFavorite}
            openMenu={openMenu}
            onMouseEnter={() => setHoveredCard(book.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onToggleFavorite={(bookId) => handleToggleFavorite(bookId, isFavorite)}
            onShare={handleShare}
            onStatusChange={handleStatusChange}
            onRatingChange={handleRatingChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMenuToggle={handleMenuToggle}
          />
        );
      })}
      
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
          animation: golden-badge 2s ease-in-out infinite, shimmer 6s infinite linear;
        }
        
        @keyframes star-spin {
          0% { transform: rotate(0deg) scale(1); filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.6)); }
          25% { transform: rotate(15deg) scale(1.2); filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.9)); }
          50% { transform: rotate(0deg) scale(1); filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.6)); }
          75% { transform: rotate(-15deg) scale(1.2); filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.9)); }
          100% { transform: rotate(0deg) scale(1); filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.6)); }
        }
        .animate-star-spin {
          animation: star-spin 3s ease-in-out infinite;
          transform-origin: center;
          filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.8));
        }
        
        /* Premium gold effect */
        .gold-text {
          background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 1px rgba(251, 191, 36, 0.5));
        }
      `}</style>
    </div>
  );
}
